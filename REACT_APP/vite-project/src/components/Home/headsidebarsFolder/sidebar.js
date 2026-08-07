import { v4 as uuidv4 } from 'uuid'
const data = [
    {
        id: uuidv4(),
        IconUrl: "https://img.icons8.com/isometric/50/activity-feed.png",
        ItemName: "Your Activity",
        path: "feed",
        placement: "primary"
    }, {
        id: uuidv4(),
        IconUrl: "https://img.icons8.com/3d-fluency/94/book-shelf.png",
        ItemName: "Syllabus",
        path: "syllabus",
        placement: "primary"
    }, {
        id: uuidv4(),
        IconUrl: "https://img.icons8.com/3d-fluency/94/combo-chart.png",
        ItemName: "Analytics",
        path: "analytics",
        placement: "primary"
    }, {
        id: uuidv4(),
        IconUrl: "https://img.icons8.com/3d-fluency/94/project.png",
        ItemName: "Projects",
        path: "projects",
        placement: "primary"
    }, {
        id: uuidv4(),
        IconUrl: "https://img.icons8.com/isometric/50/learning--v1.png",
        ItemName: "Skills",
        path: "skills",
        placement: "primary"
    },
     {
        id: uuidv4(),
        IconUrl: "https://img.icons8.com/3d-fluency/94/gear--v1.png",
        ItemName: "Settings",
        path: "setting",
        placement: "secondary"
    },
    {
        id: uuidv4(),
        IconUrl: "https://img.icons8.com/3d-fluency/94/user-male-circle.png",
        ItemName: "Profile",
        path: "profile",
        placement: "secondary"
    },
]
export default data
