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
  year: string;
  seed: number;
  pal: [string, string, string];
  accent: string;
  geo: "ring" | "line" | "none";
  prompt: string;
  media?: WorkMedia;
}

export const WORKS: Work[] = [
  { id:128, title:"夜航西飞",   en:"NIGHT FERRY",    model:"可灵 2.5",  type:"video", ratio:"16:9", dur:"00:15", year:"2026.09", seed:11,
    pal:["#0b1626","#1d3a5f","#8fc3e8"], accent:"#e8b04b", geo:"ring",
    prompt:"深夜渡轮驶离港口，探照灯扫过铅灰色海面，胶片颗粒，冷蓝调，一镜到底 --dur 15 --cfg 7.5 --seed 7742" },
  { id:127, title:"铁锈与花园", en:"RUST & GARDEN",  model:"Midjourney v7", type:"image", ratio:"3:4", year:"2026.09", seed:23,
    pal:["#190d08","#59290f","#e09a52"], accent:"#9dbb72", geo:"line",
    prompt:"废弃钢厂中央长出一座亚热带花园，铁锈橙与苔绿对撞，体积光 --ar 3:4 --s 250" },
  { id:126, title:"雨后霓虹",   en:"NEON AFTER RAIN",model:"可灵 2.5",  type:"video", ratio:"9:16", dur:"00:08", year:"2026.08", seed:37,
    pal:["#090f1e","#173058","#5ad0ff"], accent:"#ff5c8a", geo:"none",
    prompt:"雨夜街头霓虹在湿漉漉的柏油路碎成色块，倒置世界，慢门拉丝 --dur 8 --seed 2210" },
  { id:125, title:"玻璃海",     en:"THE GLASS SEA",  model:"即梦 2.5",  type:"video", ratio:"16:9", dur:"00:12", year:"2026.08", seed:41,
    pal:["#06141c","#0e3a4a","#8fe3db"], accent:"#eafcf7", geo:"line",
    prompt:"整片海面凝结为缓慢流动的玻璃，光在冰层下折射，极简，冷白 --dur 12 --seed 808" },
  { id:124, title:"十一月的房间",en:"NOVEMBER ROOM", model:"SD · FLUX", type:"image", ratio:"1:1", year:"2026.08", seed:53,
    pal:["#14110d","#393023","#c9b48a"], accent:"#efe9db", geo:"none",
    prompt:"午后四点的房间，阳光斜切过浮尘，旧木地板，伦勃朗光 --steps 40 --cfg 6" },
  { id:123, title:"候鸟电台",   en:"MIGRANT RADIO",  model:"Midjourney v7", type:"image", ratio:"3:4", year:"2026.07", seed:67,
    pal:["#0f0e18","#2c2848","#9a8cff"], accent:"#f2c94c", geo:"ring",
    prompt:"候鸟群掠过荒原上最后一座无线电塔，暮色紫与信号黄 --ar 3:4 --chaos 20" },
  { id:122, title:"纸鹤城市",   en:"ORIGAMI CITY",   model:"即梦 2.5",  type:"video", ratio:"9:16", dur:"00:10", year:"2026.07", seed:71,
    pal:["#0c0c12","#26262e","#e3e3ea"], accent:"#ff4d4d", geo:"none",
    prompt:"一只白色纸鹤穿越折纸折叠的午夜都市，单点红色，定格动画质感 --dur 10 --seed 9012" },
  { id:121, title:"赛博灯笼",   en:"NEON LANTERN",   model:"可灵 2.5",  type:"video", ratio:"16:9", dur:"00:15", year:"2026.06", seed:83,
    pal:["#160a0e","#4a1020","#ff6a4d"], accent:"#ffc24d", geo:"line",
    prompt:"上百盏霓虹灯笼沿老街屋檐次第亮起，雨夜反光，缓缓推镜 --dur 15 --seed 7742" },
  { id:120, title:"苔藓纪念碑", en:"MOSS MONUMENT",  model:"FLUX",      type:"image", ratio:"3:4", year:"2026.06", seed:89,
    pal:["#0b120c","#23402a","#a3c98a"], accent:"#e8e2c4", geo:"ring",
    prompt:"被苔藓完全吞没的混凝土纪念碑，柔雾，低饱和 --guidance 3.5" },
  { id:119, title:"蓝色时区",   en:"BLUE TIMEZONE",  model:"Midjourney v7", type:"image", ratio:"1:1", year:"2026.05", seed:97,
    pal:["#070d1a","#16305c","#6a9bff"], accent:"#f0f4ff", geo:"none",
    prompt:"凌晨三点的候机厅，所有时钟指向不同时间，蓝调时刻 --ar 1:1 --s 400" },
  { id:118, title:"废墟芭蕾",   en:"BALLET IN RUINS",model:"可灵 2.5",  type:"video", ratio:"9:16", dur:"00:08", year:"2026.05", seed:101,
    pal:["#150d12","#3c2030","#e8a0b4"], accent:"#f2e6c8", geo:"none",
    prompt:"芭蕾舞者在废弃剧院独舞，裙摆扬起灰尘，顶光，慢动作 --dur 8 --seed 3301" },
  { id:117, title:"灰尘光环",   en:"DUST HALO",      model:"Stable Diffusion", type:"image", ratio:"3:4", year:"2026.04", seed:113,
    pal:["#121008","#3a3218","#e8d48a"], accent:"#ffffff", geo:"ring",
    prompt:"老藏书室里一束光柱点燃浮尘，琥珀色调，微距 --hires fix --cfg 7" },
];
