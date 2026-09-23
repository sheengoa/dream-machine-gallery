/* 作品数据。
   真实素材就位后：为作品补充 media 字段（见 Work["media"]），
   渲染层会自动以 <img>/<video> 取代程序化占位视觉。 */
export interface WorkMedia {
  kind: "image" | "video";
  src: string;
  poster?: string;
}

export interface Work {
  id: number;
  title: string;
  en: string;
  model: string;
  type: "image" | "video";
  ratio: "16:9" | "3:4" | "1:1" | "9:16";
  dur?: string;
  /** 视频帧率（仅视频作品需要时标注，默认 24） */
  fps?: number;
  year: string;
  seed: number;
  pal: [string, string, string];
  accent: string;
  geo: "ring" | "line" | "none";
  prompt: string;
  media?: WorkMedia;
}

export const WORKS: Work[] = [
  { id:136, title:"猴与猪",     en:"MONKEY & PIG",   model:"即梦 2.5",  type:"video", ratio:"16:9", dur:"07:32", fps:30, year:"2026.09", seed:13,
    pal:["#120d0a","#33231a","#e8b04b"], accent:"#e8b04b", geo:"ring",
    prompt:"雾夜集市的赌石局：手气正旺的猿猴连赢赤金髓与金龙髓，被同伴怂恿押上全部身家八十两买下「石王」——刀落切开，只剩六两，瞬间输得精光。赌局的诱惑与反噬，七分半魔幻短片 --dur 452 --fps 30 --seed 8021",
    media:{ kind:"video", src:"/works/136.mp4", poster:"/works/136.jpg" } },
  { id:135, title:"红色声场",   en:"BORN",           model:"即梦 2.5",  type:"video", ratio:"16:9", dur:"00:15", fps:30, year:"2026.09", seed:17,
    pal:["#160b0d","#4a1020","#ff5c5c"], accent:"#ffc24d", geo:"ring",
    prompt:"红色蓝牙音箱产品片：织物质感特写、雨点敲击桌面、声波以同心圆荡开——把空间，变成你的现场 --dur 15 --fps 30 --seed 10489",
    media:{ kind:"video", src:"/works/135.mp4", poster:"/works/135.jpg" } },
  { id:134, title:"白日球场",   en:"NOICE",          model:"即梦 2.5",  type:"video", ratio:"16:9", dur:"00:14", fps:30, year:"2026.09", seed:19,
    pal:["#101318","#2c3a4e","#e8e6e0"], accent:"#f2c94c", geo:"line",
    prompt:"白色空顶帽品牌片：刺绣 logo 特写、模特侧坐在棕榈影墙前、蓝天球场一记挥拍，收在 NOICE 标版 --dur 14 --fps 30 --seed 11723",
    media:{ kind:"video", src:"/works/134.mp4", poster:"/works/134.jpg" } },
  { id:133, title:"净空时刻",   en:"PURE AS YOU SEE", model:"即梦 2.5", type:"video", ratio:"16:9", dur:"00:15", fps:30, year:"2026.09", seed:29,
    pal:["#141210","#3a352e","#e8e4da"], accent:"#8fc3e8", geo:"ring",
    prompt:"空气净化器产品片：金色浮尘光束切入暗室，气流以环形涟漪可视化穿过机身，最后落进洒满晨光的客厅——纯净，如你所见 --dur 15 --fps 30 --seed 17893",
    media:{ kind:"video", src:"/works/133.mp4", poster:"/works/133.jpg" } },
  { id:132, title:"大漠琵琶",   en:"DESERT PIPA",    model:"通义万相 3.0", type:"video", ratio:"16:9", dur:"00:20", year:"2026.09", seed:7,
    pal:["#160a10","#5b1626","#ff6a3d"], accent:"#ffc24d", geo:"ring",
    prompt:"燃烧的晚霞压过大漠沙脊，废弃马车半陷流沙，红衣乐手坐上沙丘最高处拨响琵琶，风撩动裙摆与云层，电影感广角，暖橙与绛紫对撞 --dur 20 --cfg 7.5 --seed 4319",
    media:{ kind:"video", src:"/works/132.mp4", poster:"/works/132.jpg" } },
  { id:131, title:"末班之后",   en:"AFTER THE LAST TRAIN", model:"即梦 2.5", type:"video", ratio:"16:9", dur:"00:15", year:"2026.09", seed:5,
    pal:["#0a0c0f","#1c222b","#aeb9c4"], accent:"#e8a04d", geo:"line",
    prompt:"末班车离开后的空站台，浓雾未散，一男一女隔着黄线相对无言，唯一一盏钠灯在雾里晕开暖橙，监视器质感，宽画幅，极简 --dur 15 --seed 3085",
    media:{ kind:"video", src:"/works/131.mp4", poster:"/works/131.jpg" } },
  { id:130, title:"麦田钓客",   en:"THE CATCHER IN THE RYE", model:"通义万相 3.0", type:"video", ratio:"16:9", dur:"00:20", year:"2026.09", seed:3,
    pal:["#04141a","#0d3a40","#48d8c8"], accent:"#ff5c8a", geo:"line",
    prompt:"公园长椅上的老人甩竿垂钓，镜头随鱼线坠入水中——霓虹符号在暗绿深水里游弋，一尾巨鱼咬住鱼钩，浮出书名《麦田里的守望者》，超现实拼贴，青绿与霓虹撞色 --dur 20 --seed 1851",
    media:{ kind:"video", src:"/works/130.mp4", poster:"/works/130.jpg" } },
  { id:129, title:"玩具仙子",   en:"TOY FAIRY",      model:"通义万相 3.0", type:"video", ratio:"16:9", dur:"00:10", fps:30, year:"2026.09", seed:2,
    pal:["#0d1420","#1d3a5f","#8fc3e8"], accent:"#ff9ec4", geo:"ring",
    prompt:"孩童房间的地毯上，掌心大的花仙子掠过玩具城堡与绒毛熊，一头扎进积木池塘，坠入珊瑚与光柱的海底，三维动画质感，微距浅景深 --dur 10 --seed 1234",
    media:{ kind:"video", src:"/works/129.mp4", poster:"/works/129.jpg" } },
  { id:128, title:"夜航西飞",   en:"NIGHT FERRY",    model:"即梦 2.5",  type:"video", ratio:"16:9", dur:"00:15", year:"2026.09", seed:11,
    pal:["#0b1626","#1d3a5f","#8fc3e8"], accent:"#e8b04b", geo:"ring",
    prompt:"深夜渡轮驶离港口，探照灯扫过铅灰色海面，胶片颗粒，冷蓝调，一镜到底 --dur 15 --cfg 7.5 --seed 6787",
    media:{ kind:"video", src:"/works/128.mp4", poster:"/works/128.jpg" } },
  { id:127, title:"铁锈与花园", en:"RUST & GARDEN",  model:"Midjourney v7", type:"image", ratio:"3:4", year:"2026.09", seed:23,
    pal:["#190d08","#59290f","#e09a52"], accent:"#9dbb72", geo:"line",
    prompt:"废弃钢厂中央长出一座亚热带花园，铁锈橙与苔绿对撞，体积光 --ar 3:4 --s 250" },
  { id:126, title:"雨后霓虹",   en:"NEON AFTER RAIN",model:"可灵 3.0",  type:"video", ratio:"9:16", dur:"00:08", year:"2026.08", seed:37,
    pal:["#090f1e","#173058","#5ad0ff"], accent:"#ff5c8a", geo:"none",
    prompt:"雨夜街头霓虹在湿漉漉的柏油路碎成色块，倒置世界，慢门拉丝 --dur 8 --seed 22829",
    media:{ kind:"video", src:"/works/126.mp4", poster:"/works/126.jpg" } },
  { id:125, title:"玻璃海",     en:"THE GLASS SEA",  model:"即梦 2.5",  type:"video", ratio:"16:9", dur:"00:12", year:"2026.08", seed:41,
    pal:["#06141c","#0e3a4a","#8fe3db"], accent:"#eafcf7", geo:"line",
    prompt:"整片海面凝结为缓慢流动的玻璃，光在冰层下折射，极简，冷白 --dur 12 --seed 25297",
    media:{ kind:"video", src:"/works/125.mp4", poster:"/works/125.jpg" } },
  { id:124, title:"十一月的房间",en:"NOVEMBER ROOM", model:"SD · FLUX", type:"image", ratio:"1:1", year:"2026.08", seed:53,
    pal:["#14110d","#393023","#c9b48a"], accent:"#efe9db", geo:"none",
    prompt:"午后四点的房间，阳光斜切过浮尘，旧木地板，伦勃朗光 --steps 40 --cfg 6" },
  { id:123, title:"候鸟电台",   en:"MIGRANT RADIO",  model:"Midjourney v7", type:"image", ratio:"3:4", year:"2026.07", seed:67,
    pal:["#0f0e18","#2c2848","#9a8cff"], accent:"#f2c94c", geo:"ring",
    prompt:"候鸟群掠过荒原上最后一座无线电塔，暮色紫与信号黄 --ar 3:4 --chaos 20" },
  { id:122, title:"纸鹤城市",   en:"ORIGAMI CITY",   model:"即梦 2.5",  type:"video", ratio:"9:16", dur:"00:10", year:"2026.07", seed:71,
    pal:["#0c0c12","#26262e","#e3e3ea"], accent:"#ff4d4d", geo:"none",
    prompt:"一只白色纸鹤穿越折纸折叠的午夜都市，单点红色，定格动画质感 --dur 10 --seed 43807",
    media:{ kind:"video", src:"/works/122.mp4", poster:"/works/122.jpg" } },
  { id:121, title:"赛博灯笼",   en:"NEON LANTERN",   model:"可灵 3.0",  type:"video", ratio:"16:9", dur:"00:15", year:"2026.06", seed:83,
    pal:["#160a0e","#4a1020","#ff6a4d"], accent:"#ffc24d", geo:"line",
    prompt:"上百盏霓虹灯笼沿老街屋檐次第亮起，雨夜反光，缓缓推镜 --dur 15 --seed 51211",
    media:{ kind:"video", src:"/works/121.mp4", poster:"/works/121.jpg" } },
  { id:120, title:"苔藓纪念碑", en:"MOSS MONUMENT",  model:"FLUX",      type:"image", ratio:"3:4", year:"2026.06", seed:89,
    pal:["#0b120c","#23402a","#a3c98a"], accent:"#e8e2c4", geo:"ring",
    prompt:"被苔藓完全吞没的混凝土纪念碑，柔雾，低饱和 --guidance 3.5" },
  { id:119, title:"蓝色时区",   en:"BLUE TIMEZONE",  model:"Midjourney v7", type:"image", ratio:"1:1", year:"2026.05", seed:97,
    pal:["#070d1a","#16305c","#6a9bff"], accent:"#f0f4ff", geo:"none",
    prompt:"凌晨三点的候机厅，所有时钟指向不同时间，蓝调时刻 --ar 1:1 --s 400" },
  { id:118, title:"废墟芭蕾",   en:"BALLET IN RUINS",model:"可灵 3.0",  type:"video", ratio:"9:16", dur:"00:08", year:"2026.05", seed:101,
    pal:["#150d12","#3c2030","#e8a0b4"], accent:"#f2e6c8", geo:"none",
    prompt:"芭蕾舞者在废弃剧院独舞，裙摆扬起灰尘，顶光，慢动作 --dur 8 --seed 62317",
    media:{ kind:"video", src:"/works/118.mp4", poster:"/works/118.jpg" } },
  { id:117, title:"灰尘光环",   en:"DUST HALO",      model:"Stable Diffusion", type:"image", ratio:"3:4", year:"2026.04", seed:113,
    pal:["#121008","#3a3218","#e8d48a"], accent:"#ffffff", geo:"ring",
    prompt:"老藏书室里一束光柱点燃浮尘，琥珀色调，微距 --hires fix --cfg 7" },
];
