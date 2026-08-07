import User from "../models/User.js";
import Post from "../models/Post.js";
import Project from "../models/Project.js";
import Notification from "../models/Notification.js";
import SocialRequest from "../models/SocialRequest.js";
import { broadcastToUser } from "../realtime.js";

const currentUser = (req) => String(req.user.id);

const publicUser = (user) => ({
    _id: user._id,
    name: user.name,
    username: user.username || "",
    avatar: user.avatar || "",
});

const notify = async ({ recipient, actor, type, request = null, project = null, post = null, message }) => {
    const notification = await Notification.create({ recipient, actor, type, request, project, post, message });
    broadcastToUser(recipient, { type: "inbox:changed" });
    return notification;
};

export const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        const { name, email, username } = req.body;
        if (name !== undefined) user.name = String(name).trim();
        if (email !== undefined) user.email = String(email).trim().toLowerCase();
        if (username !== undefined) {
            const normalized = String(username).trim().toLowerCase().replace(/^@/, "");
            if (!/^[a-z0-9_]{3,30}$/.test(normalized)) return res.status(400).json({ message: "Username must be 3-30 characters using letters, numbers, or underscores" });
            user.username = normalized;
        }
        await user.save();
        return res.status(200).json(user.toObject({ transform: (_, value) => { delete value.password; return value; } }));
    } catch (error) {
        if (error.code === 11000) return res.status(409).json({ message: "That username or email is already in use" });
        return res.status(500).json({ message: error.message });
    }
};

export const searchPeople = async (req, res) => {
    try {
        const query = String(req.query.q || "").trim().replace(/^@/, "").toLowerCase();
        if (query.length < 2) return res.status(200).json([]);
        const users = await User.find({ _id: { $ne: req.user.id }, username: { $regex: query, $options: "i" } }).select("name username avatar").limit(12).lean();
        const userIds = users.map((user) => user._id);
        const statuses = await SocialRequest.find({ type: "follow", status: { $in: ["pending", "accepted"] }, $or: [{ requester: req.user.id, recipient: { $in: userIds } }, { requester: { $in: userIds }, recipient: req.user.id }] }).select("requester recipient status _id").lean();
        return res.status(200).json(users.map((user) => {
            const relationshipStatuses = statuses.filter((item) => String(item.recipient) === String(user._id) || String(item.requester) === String(user._id));
            const status = relationshipStatuses.find((item) => item.status === "accepted") || relationshipStatuses[0];
            return { ...publicUser(user), followStatus: status?.status || "none", requestId: status?._id || null };
        }));
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getPublicProfile = async (req, res) => {
    try {
        const username = String(req.params.username || "").trim().toLowerCase().replace(/^@/, "");
        const user = await User.findOne({ username }).select("name username avatar createdAt followers following").lean();
        if (!user) return res.status(404).json({ message: "Profile not found" });
        const [posts, request] = await Promise.all([
            Post.find({ author: user._id }).populate("author", "name username avatar").populate("comments.author", "name username avatar").sort({ createdAt: -1 }).limit(20).lean(),
            String(user._id) === currentUser(req) ? null : SocialRequest.findOne({ type: "follow", status: "accepted", $or: [{ requester: req.user.id, recipient: user._id }, { requester: user._id, recipient: req.user.id }] }).select("_id status").lean().then((accepted) => accepted || SocialRequest.findOne({ type: "follow", status: "pending", $or: [{ requester: req.user.id, recipient: user._id }, { requester: user._id, recipient: req.user.id }] }).select("_id status").lean()),
        ]);
        return res.status(200).json({ profile: { ...publicUser(user), followersCount: user.followers?.length || 0, followingCount: user.following?.length || 0, isSelf: String(user._id) === currentUser(req), followStatus: request?.status || "none", requestId: request?._id || null }, posts: posts.map((post) => ({ ...post, likesCount: post.likes.length, liked: post.likes.some((id) => String(id) === currentUser(req)) })) });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const createFollowRequest = async (req, res) => {
    try {
        const username = String(req.params.username || "").toLowerCase().replace(/^@/, "");
        const recipient = await User.findOne({ username });
        if (!recipient) return res.status(404).json({ message: "User not found" });
        if (String(recipient._id) === currentUser(req)) return res.status(400).json({ message: "You cannot follow yourself" });
        const acceptedRelationship = await SocialRequest.findOne({ type: "follow", status: "accepted", $or: [{ requester: req.user.id, recipient: recipient._id }, { requester: recipient._id, recipient: req.user.id }] });
        if (acceptedRelationship || recipient.followers.some((id) => String(id) === currentUser(req)) || recipient.following?.some((id) => String(id) === currentUser(req))) return res.status(409).json({ message: "You are already connected with this person" });
        const existing = await SocialRequest.findOne({ requester: req.user.id, recipient: recipient._id, type: "follow" });
        if (existing?.status === "pending") return res.status(409).json({ message: "Follow request is already pending" });
        const request = existing ? await SocialRequest.findByIdAndUpdate(existing._id, { status: "pending" }, { new: true }) : await SocialRequest.create({ requester: req.user.id, recipient: recipient._id, type: "follow" });
        const actor = await User.findById(req.user.id).select("name username");
        await notify({ recipient: recipient._id, actor: req.user.id, type: "follow_request", request: request._id, message: `${actor?.name || "Someone"} sent you a follow request` });
        return res.status(201).json({ requestId: request._id, status: request.status });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const unfollowUser = async (req, res) => {
    try {
        const username = String(req.params.username || "").toLowerCase().replace(/^@/, "");
        const target = await User.findOne({ username });
        if (!target) return res.status(404).json({ message: "User not found" });
        if (String(target._id) === currentUser(req)) return res.status(400).json({ message: "You cannot unfollow yourself" });
        await User.findByIdAndUpdate(req.user.id, { $pull: { following: target._id } });
        await User.findByIdAndUpdate(target._id, { $pull: { followers: req.user.id } });
        await SocialRequest.updateOne({ requester: req.user.id, recipient: target._id, type: "follow", status: "accepted" }, { $set: { status: "cancelled" } });
        broadcastToUser(target._id, { type: "inbox:changed" });
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getConnections = async (req, res) => {
    try {
        const username = String(req.params.username || "").toLowerCase().replace(/^@/, "");
        const type = req.query.type === "following" ? "following" : "followers";
        const user = await User.findOne({ username }).select(type).populate(type, "name username avatar").lean();
        if (!user) return res.status(404).json({ message: "Profile not found" });
        return res.status(200).json(user[type].map(publicUser));
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const createCollaborationRequest = async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.projectId, $or: [{ user: req.user.id }, { "collaborators.user": req.user.id }] });
        if (!project) return res.status(404).json({ message: "Project not found or inaccessible" });
        const username = String(req.body.username || "").trim().toLowerCase().replace(/^@/, "");
        const recipient = await User.findOne({ username });
        if (!recipient) return res.status(404).json({ message: "User not found" });
        if (String(recipient._id) === currentUser(req)) return res.status(400).json({ message: "Choose another user" });
        if (project.collaborators.some((item) => String(item.user) === String(recipient._id)) || String(project.user) === String(recipient._id)) return res.status(409).json({ message: "This person already has project access" });
        const existing = await SocialRequest.findOne({ requester: req.user.id, recipient: recipient._id, project: project._id, type: "collaborate" });
        if (existing?.status === "pending") return res.status(409).json({ message: "Collaboration request is already pending" });
        const request = existing ? await SocialRequest.findByIdAndUpdate(existing._id, { status: "pending" }, { new: true }) : await SocialRequest.create({ requester: req.user.id, recipient: recipient._id, project: project._id, type: "collaborate" });
        const actor = await User.findById(req.user.id).select("name");
        await notify({ recipient: recipient._id, actor: req.user.id, type: "collaboration_request", request: request._id, project: project._id, message: `${actor?.name || "Someone"} invited you to collaborate on ${project.name}` });
        return res.status(201).json({ requestId: request._id, status: request.status });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const respondToRequest = async (req, res) => {
    try {
        const request = await SocialRequest.findById(req.params.id).populate("project", "name");
        if (!request) return res.status(404).json({ message: "Request not found" });
        const action = String(req.body.action || "");
        if (!["approve", "reject", "cancel"].includes(action)) return res.status(400).json({ message: "Invalid request action" });
        const isRecipient = String(request.recipient) === currentUser(req);
        const isRequester = String(request.requester) === currentUser(req);
        if ((action === "cancel" && !isRequester) || (action !== "cancel" && !isRecipient)) return res.status(403).json({ message: "You cannot change this request" });
        request.status = action === "approve" ? "accepted" : action === "reject" ? "rejected" : "cancelled";
        await request.save();
        if (action === "approve" && request.type === "follow") {
            await User.findByIdAndUpdate(request.recipient, { $addToSet: { followers: request.requester } });
            await User.findByIdAndUpdate(request.requester, { $addToSet: { following: request.recipient } });
            // A follow approval creates a mutual connection and resolves an older reverse request.
            const reciprocal = await SocialRequest.findOneAndUpdate({ requester: request.recipient, recipient: request.requester, type: "follow", status: "pending" }, { $set: { status: "accepted" } }, { new: true });
            if (reciprocal) {
                await User.findByIdAndUpdate(request.requester, { $addToSet: { followers: request.recipient } });
                await User.findByIdAndUpdate(request.recipient, { $addToSet: { following: request.requester } });
            }
        }
        if (action === "approve" && request.type === "collaborate" && request.project) await Project.findByIdAndUpdate(request.project._id, { $addToSet: { collaborators: { user: request.requester } } });
        if (action === "approve") {
            const actor = await User.findById(req.user.id).select("name");
            await notify({ recipient: request.requester, actor: req.user.id, type: request.type === "follow" ? "follow_accepted" : "collaboration_accepted", project: request.project?._id || null, message: request.type === "follow" ? `${actor?.name || "Someone"} accepted your follow request` : `${actor?.name || "Someone"} accepted your collaboration request` });
        }
        broadcastToUser(request.requester, { type: "inbox:changed" });
        broadcastToUser(request.recipient, { type: "inbox:changed" });
        return res.status(200).json(request);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getInbox = async (req, res) => {
    try {
        const [pendingRequests, notifications] = await Promise.all([
            SocialRequest.find({ recipient: req.user.id, status: "pending" }).populate("requester", "name username avatar").populate("project", "name").sort({ createdAt: -1 }).lean(),
            Notification.find({ recipient: req.user.id }).populate("actor", "name username avatar").populate("project", "name").sort({ createdAt: -1 }).limit(40).lean(),
        ]);
        const requests = (await Promise.all(pendingRequests.map(async (request) => {
            if (request.type !== "follow") return request;
            const accepted = await SocialRequest.exists({ type: "follow", status: "accepted", $or: [{ requester: request.requester._id, recipient: req.user.id }, { requester: req.user.id, recipient: request.requester._id }] });
            return accepted ? null : request;
        }))).filter(Boolean);
        return res.status(200).json({ requests, notifications, unreadCount: notifications.filter((item) => !item.read).length });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const markNotificationRead = async (req, res) => {
    try {
        await Notification.updateOne({ _id: req.params.id, recipient: req.user.id }, { $set: { read: true } });
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getFeed = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("following").lean();
        const scope = req.query.scope === "following";
        const authors = scope ? [req.user.id, ...(user?.following || [])] : undefined;
        const posts = await Post.find(authors ? { author: { $in: authors } } : {}).populate("author", "name username avatar").populate("comments.author", "name username avatar").sort({ createdAt: -1 }).limit(50).lean();
        return res.status(200).json(posts.map((post) => ({ ...post, likesCount: post.likes.length, liked: post.likes.some((id) => String(id) === currentUser(req)) })));
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const createPost = async (req, res) => {
    try {
        const content = String(req.body.content || "").trim();
        if (!content) return res.status(400).json({ message: "Write something before posting" });
        const image = String(req.body.image || "");
        if (image && (!image.startsWith("data:image/") || image.length > 5000000)) return res.status(400).json({ message: "Use an image smaller than 3.5 MB" });
        const usernames = [...new Set([...content.matchAll(/@([a-z0-9_]{3,30})/gi)].map((match) => match[1].toLowerCase()))];
        const mentionedUsers = await User.find({ username: { $in: usernames }, _id: { $ne: req.user.id } }).select("_id username");
        const post = await Post.create({ author: req.user.id, content, image, mentions: mentionedUsers.map((user) => ({ user: user._id, username: user.username })) });
        const actor = await User.findById(req.user.id).select("name");
        await Promise.all(mentionedUsers.map((user) => notify({ recipient: user._id, actor: req.user.id, type: "mention", post: post._id, message: `${actor?.name || "Someone"} mentioned you in a post` })));
        const response = await Post.findById(post._id).populate("author", "name username avatar").lean();
        return res.status(201).json({ ...response, likesCount: 0, liked: false });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const createComment = async (req, res) => {
    try {
        const content = String(req.body.content || "").trim();
        if (!content) return res.status(400).json({ message: "Comment cannot be empty" });
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });
        post.comments.push({ author: req.user.id, content });
        await post.save();
        if (String(post.author) !== currentUser(req)) {
            const actor = await User.findById(req.user.id).select("name");
            await notify({ recipient: post.author, actor: req.user.id, type: "comment", post: post._id, message: `${actor?.name || "Someone"} commented on your post` });
        }
        const response = await Post.findById(post._id).populate("comments.author", "name username avatar").lean();
        return res.status(201).json(response.comments.at(-1));
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const toggleLike = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });
        const liked = post.likes.some((id) => String(id) === currentUser(req));
        if (liked) post.likes = post.likes.filter((id) => String(id) !== currentUser(req));
        else post.likes.push(req.user.id);
        await post.save();
        return res.status(200).json({ liked: !liked, likesCount: post.likes.length });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
