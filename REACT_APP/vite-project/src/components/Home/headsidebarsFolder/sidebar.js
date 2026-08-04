import { v4 as uuidv4 } from 'uuid'
const data = [
    {
        id: uuidv4(),
        IconUrl: "https://img.icons8.com/isometric/50/activity-feed.png",
        ItemName: "Your Activity",
        path: "feed"
    }, {
        id: uuidv4(),
        IconUrl: "https://img.icons8.com/3d-fluency/94/gear--v1.png",
        ItemName: "Settings",
        path: "setting"
    }, {
        id: uuidv4(),
        IconUrl: "https://img.icons8.com/3d-fluency/94/combo-chart.png",
        ItemName: "Analytics",
        path: "analytics"
    },
    {
        id: uuidv4(),
        IconUrl: "https://img.icons8.com/3d-fluency/94/user-male-circle.png",
        ItemName: "Profile",
        path: "profile"
    }
]
export default data