# 图像素材填充提示词 · 六件图像作品

为 `src/data/works.ts` 中剩余 6 个 `type: "image"` 作品位准备的生图提示词（No.127 / 124 / 123 / 120 / 119 / 117，当前均为程序化渐变占位视觉）。
每件作品给 **中文自然语言版**（即梦 · 通义万相图片等国产模型直接投喂）与 **英文参数版**（Midjourney / FLUX / SD 风格，与作品数据的虚构模型口径一致）两版，创意与画面完全一致，用哪套工具生成都进同一个作品位。
画幅与 `works.ts` 的 `ratio` 字段严格对齐，生成后可直接入站。

---

## 全局约定（先读这一段）

### 暗厅气质是硬约束

画廊底色 `#0a0a0b`，六件图必须扛得住"深色页面上一张亮图"的考验：**画面主体允许亮，但四角与暗部要沉得下去**，不要高调过曝的空气感。每件的 `pal` 三色就是该图的调色板锚点（暗部色 → 中间调 → 高光色），`accent` 是唯一的点睛色——画面里只能有一处明确点睛，不要处处强调。

### 一件一种风格，互不重复

| 作品 | 风格锚点 | 气质 |
|---|---|---|
| No.127 铁锈与花园 | 工业废墟 × 亚热带植物，体积光 | 后启示录生机 |
| No.124 十一月的房间 | 荷兰静物式室内光，伦勃朗侧光 | 时间凝滞的怀旧 |
| No.123 候鸟电台 | 荒原剪影摄影，暮色大场面 | 史诗的孤独 |
| No.120 苔藓纪念碑 | 极简主义景观，低饱和柔雾 | 当代艺术装置 |
| No.119 蓝色时区 | 冷调建筑空间摄影，几何秩序 | 深夜旅途 |
| No.117 灰尘光环 | 暗调微距，单光源丁达尔 | 藏书室的神性 |

### 尺寸、格式与清洁交付

- **3:4 四件（No.127 / 123 / 120 / 117）**：建议 1152×1536 或 1440×1920；**1:1 两件（No.124 / 119）**：建议 1536×1536。
- 交付 **JPG**，单张 ≤ 500KB（站点已全局颗粒层，图内不需要另加强颗粒）。
- **清洁交付**：无文字、无水印、无签名、无边框。作品数据里的 `--ar / --s / --seed` 等是站点展示用的虚构参数，与生成无关，**不要带进输入框**（英文参数版的真实参数除外）。

### 生成后怎么接入

1. 按下方命名存为 `public/works/{id}.jpg`（如 `public/works/127.jpg`）。
2. 在 `works.ts` 对应作品补一行 media（图像作品无 poster 字段）：

```ts
media: { kind: "image", src: "/works/127.jpg" },
```

3. 或者：生成好的图直接丢给 ZCode，接入、构建、部署一条龙代劳。六张全部就位后，作品墙的「图像 06」筛选将不再出现任何渐变占位。

---

## No.127 铁锈与花园 RUST & GARDEN — 3:4 ｜ Midjourney v7

> 对应数据：`pal: #190d08 → #59290f → #e09a52`，`accent: #9dbb72`（苔绿点睛）。
> 画面：废弃钢铁厂中央长出亚热带花园，铁锈橙与苔绿对撞，体积光从破顶斜切。竖构图取厂房纵深，低角度仰拍。

**中文版（即梦 / 万相）**

```text
废弃钢铁厂内部，一座亚热带花园从锈蚀的钢梁、齿轮与传送带之间生长出来，蕨类与阔叶植物缠绕生锈的机械。体积光从厂房破顶斜切而下，照亮铁锈橙与苔绿的对撞色。低角度仰拍，竖构图取厂房纵深，电影感，细节丰富，暗部沉稳。无文字、无水印。
```

**英文版（Midjourney v7）**

```text
abandoned steel mill overtaken by a subtropical garden, ferns and broadleaf plants wrapping rusted conveyor belts and gears, volumetric light shafts cutting through the broken roof, rust-orange and moss-green contrast, low-angle vertical composition, cinematic, hyper-detailed, deep shadows --ar 3:4 --s 250
```

---

## No.124 十一月的房间 NOVEMBER ROOM — 1:1 ｜ SD · FLUX

> 对应数据：`pal: #14110d → #393023 → #c9b48a`，`accent: #efe9db`（暖白高光）。
> 画面：午后四点的老房间，阳光斜切浮尘，伦勃朗侧光。方构图取光带与地板的几何关系，安静怀旧。

**中文版（即梦 / 万相）**

```text
午后四点的老房间，阳光从侧面窗户斜切进空气，一道暖色光带落在磨损的旧木地板上，浮尘在光里缓缓漂浮。墙面斑驳，一把空木椅，伦勃朗式侧光，明暗过渡细腻。方构图，安静怀旧，轻微胶片颗粒，暗部沉底。无文字、无水印。
```

**英文版（FLUX；SD 用户按备注参数）**

```text
an old room at four in the afternoon, sunlight slanting through floating dust, a warm band of light across worn wooden floorboards, mottled walls, a single empty wooden chair, Rembrandt side lighting, quiet nostalgic mood, subtle film grain, deep shadows, square composition
```

> SD WebUI 备注：`steps 40 · cfg 6`，开 hires fix ×1.5。

---

## No.123 候鸟电台 MIGRANT RADIO — 3:4 ｜ Midjourney v7

> 对应数据：`pal: #0f0e18 → #2c2848 → #9a8cff`，`accent: #f2c94c`（信号黄点睛）。
> 画面：暮色荒原上候鸟群掠过最后一座无线电塔，暮色紫与信号黄对撞。竖构图让铁塔剪影顶天立地。

**中文版（即梦 / 万相）**

```text
暮色荒原，成群候鸟掠过旷野上最后一座无线电塔，铁塔剪影顶天立地，塔顶一盏信号灯亮着暖黄。天空是暮色紫向深蓝的过渡，与信号黄对撞。广角低角度仰拍，竖构图，鸟群呈斜线动势，史诗而安静。无文字、无水印。
```

**英文版（Midjourney v7）**

```text
migratory birds sweeping past the last radio tower standing on a dusk wasteland, tower silhouette topped with a single glowing signal lamp, twilight purple sky against signal-yellow light, wide-angle low shot, birds in a diagonal sweep, epic and quiet, vertical composition --ar 3:4 --chaos 20 --s 250
```

---

## No.120 苔藓纪念碑 MOSS MONUMENT — 3:4 ｜ FLUX

> 对应数据：`pal: #0b120c → #23402a → #a3c98a`，`accent: #e8e2c4`（雾白留白）。
> 画面：被苔藓完全吞没的混凝土纪念碑，柔雾低饱和。正面对称构图，大量呼吸感留白，像时间停止的装置艺术。

**中文版（即梦 / 万相）**

```text
一座混凝土纪念碑被厚厚的苔藓完全吞没，只在碑体一角露出少许刻字的痕迹。柔雾弥漫，低饱和的绿灰色调，正面对称构图，画面大量留白，安静得像时间停止。当代艺术装置感，竖构图，暗部沉稳，细节细腻。无文字、无水印。
```

**英文版（FLUX）**

```text
a concrete monument completely swallowed by thick moss, only a corner of weathered carved lettering exposed, soft drifting fog, desaturated green-grey palette, symmetrical frontal composition with generous negative space, the stillness of stopped time, contemporary art installation feel, vertical framing, deep calm shadows, fine detail
```

---

## No.119 蓝色时区 BLUE TIMEZONE — 1:1 ｜ Midjourney v7

> 对应数据：`pal: #070d1a → #16305c → #6a9bff`，`accent: #f0f4ff`（冷白高光）。
> 画面：凌晨三点的候机厅，一排时钟指向不同时间。方构图取挂钟阵列与落地窗蓝调的几何秩序。

**中文版（即梦 / 万相）**

```text
凌晨三点的国际机场候机厅，空无一人，墙上一排圆形挂钟各自指向不同的时间。落地窗外停机坪浸在蓝调时刻的深蓝里，连排座椅的剪影延伸向远方。冷蓝主调，少量冷白高光点缀，几何构图，孤独而平静，方构图。无文字、无水印。
```

**英文版（Midjourney v7）**

```text
empty international departure hall at 3 a.m., a row of round clocks on the wall each showing a different time, deep blue-hour light flooding through floor-to-ceiling windows, silhouetted rows of seating receding into the distance, cold blue palette with crisp white highlights, geometric order, lonely and calm, square composition --ar 1:1 --s 400
```

---

## No.117 灰尘光环 DUST HALO — 3:4 ｜ Stable Diffusion

> 对应数据：`pal: #121008 → #3a3218 → #e8d48a`，`accent: #ffffff`（光柱核心）。
> 画面：老藏书室一束光柱点燃浮尘。竖构图让光柱从高窗垂直落下，暗部吞掉书架，只留光的舞台。

**中文版（即梦 / 万相）**

```text
老藏书室深处，一束光柱从高窗垂直落下，点燃空气中的浮尘，金色微尘在光柱里缓缓盘旋。高大的深色书架没入阴影，只留光柱成为唯一舞台。琥珀色调，微距质感，暗部几乎沉为纯黑。竖构图，神圣而安静。无文字、无水印。
```

**英文版（SD WebUI）**

```text
deep inside an old library, a single shaft of light falls from a high window igniting floating dust, golden motes swirling slowly inside the beam, towering dark bookshelves receding into near-black shadow, amber tones, macro photographic feel, sacred and silent atmosphere, vertical composition
```

> SD WebUI 备注：`cfg 7`，开 hires fix ×1.5；暗部易脏，可加负向 `washed out, low contrast`。

---

## 附：接入后的最终形态

六张全部就位后：作品墙 **20 件全部为真实素材**，渐变占位视觉只保留在「图像」位之外没有数据的位置（不存在）；「图像 06」筛选点开全是成图；各作品灯箱比例自适应（3:4 竖框 / 1:1 方框）自动生效，无需任何前端改动。
