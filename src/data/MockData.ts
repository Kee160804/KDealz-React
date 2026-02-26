// // data/MockData.ts

// export const products = [
//   // BEAUTY & BODY CARE 
//   // EOS Products 
//   {
//     id: 1,
//     name: "EOS Lotion (Vanilla)",
//     description: "A rich blend of whipped vanilla, soft musk, and caramel creates a smooth, comforting scent that wraps skin in warmth. Sweet, creamy, and irresistible. ",
//     price: 12.99,
//     image: "https://evolutionofsmooth.com/cdn/shop/files/VanillaCashmereBL_2.jpg?v=1758024162&width=900",
//     stock: 15,
//     category: "beauty-bodycare",
//     subCategory: "lotion",
//     tags: ["eos", "body-wash", "lotion", "moisturizing", "shea-butter"]
//   },
//   {
//     id: 2,
//     name: "EOS Lotion (Pink Champagne)",
//     description: "With notes of pear champagne, ruby pomegranate, and plum suede, this bright, juicy scent feels crisp, playful, and elevated. It's a celebration for your skin.",
//     price: 12.99,
//     image: "https://evolutionofsmooth.com/cdn/shop/files/PinkChampagneBL.jpg?v=1758024243&width=900",
//     stock: 45,
//     category: "beauty-bodycare",
//     subCategory: "lotion",
//     tags: ["eos", "body-wash", "lotion", "moisturizing", "shea-butter"]
//   },
//   {
//     id: 3,
//     name: "EOS Lotion (Strawberry Dream)",
//     description: "Featuring notes of sparkling strawberry, pink sugar, and vanilla cream, this rich, dreamy scent wraps your skin in sweet, creamy deliciousness.",
//     price: 12.99,
//     image: "https://evolutionofsmooth.com/cdn/shop/files/StrawberryDreamBL.jpg?v=1758024195&width=900",
//     stock: 45,
//     category: "beauty-bodycare",
//     subCategory: "lotion",
//     tags: ["eos", "body-wash", "lotion", "moisturizing", "shea-butter"]
//   },
//   {
//     id: 4,
//     name: "EOS Lotion (Fragrance Free)",
//     description: "Gentle, fragrance-free hydration that soothes and strengthens extra-sensitive skin—leaving it soft, smooth, and calm.",
//     price: 12.99,
//     image: "https://evolutionofsmooth.com/cdn/shop/files/Sensitive_Skin.jpg?v=1762353481&width=900",
//     stock: 45,
//     category: "beauty-bodycare",
//     subCategory: "lotion",
//     tags: ["eos", "body-wash", "lotion", "moisturizing", "shea-butter"]
//   },
//   {
//     id: 5,
//     name: "EOS Lotion (Creme de Pistachio)",
//     description: "Toasted pistachio, decadent toffee, and warm woods come together in a rich, cozy scent that feels like creamy pistachio gelato—elevated, indulgent, and impossible to resist.",
//     price: 12.99,
//     image: "https://evolutionofsmooth.com/cdn/shop/files/CremedePistachioBL.jpg?v=1758024334&width=900",
//     stock: 45,
//     category: "beauty-bodycare",
//     subCategory: "lotion",
//     tags: ["eos", "body-wash", "lotion", "moisturizing", "shea-butter"]
//   },
//   {
//     id: 6,
//     name: "EOS Lotion (Jasmine Peach)",
//     description: "Apricot nectar, sparkling jasmine, and warm vanilla sugar blend into a bright, juicy scent that’s fresh, smooth, and perfectly balanced.",
//     price: 12.99,
//     image: "https://evolutionofsmooth.com/cdn/shop/files/JasminePeachBL.jpg?v=1758024265&width=900",
//     stock: 45,
//     category: "beauty-bodycare",
//     subCategory: "lotion",
//     tags: ["eos", "body-wash", "lotion", "moisturizing", "shea-butter"]
//   },
//   {
//     id: 7,
//     name: "EOS Lotion (Fresh + Cozy)",
//     description: "Morning light, dewy cassis, and sheer musk blend into a soft, airy scent that feels calm, cozy, and effortlessly fresh.",
//     price: 12.99,
//     image: "https://evolutionofsmooth.com/cdn/shop/files/Fresh_CozyBL.jpg?v=1758024288&width=900",
//     stock: 45,
//     category: "beauty-bodycare",
//     subCategory: "lotion",
//     tags: ["eos", "body-wash", "lotion", "moisturizing", "shea-butter"]
//   },

//   //EOS BODY WASH  
//   {
//     id: 8,
//     name: "EOS Body Wash (Strawberry Dream)",
//     description: "Sparkling strawberry, pink sugar, and vanilla cream swirl into a rich, dreamy scent that makes every wash feel sweet, creamy, and totally delicious.",
//     price: 12.99,
//     image: "https://evolutionofsmooth.com/cdn/shop/files/bodywash_SD_MainPack_1000X1161_3f960bbc-21bf-4486-ba2a-2293c0dd77e9.jpg?v=1767374064&width=900",
//     stock: 15,
//     category: "beauty-bodycare",
//     subCategory: "body-wash",
//     tags: ["eos", "body-wash", "moisturizing", "shea-butter"]
//   },
//   {
//     id: 9,
//     name: "EOS Body Wash (Creme de Pistachio)",
//     description: "Toasted pistachio, vanilla toffee, and warm woods melt into a rich, cozy scent that makes every wash feel creamy, decadent, and totally indulgent.",
//     price: 12.99,
//     image: "https://evolutionofsmooth.com/cdn/shop/files/bodywash_P_MainPack_1000X1161_cc910c84-61dd-4ac6-9203-76b5663bf7df.jpg?v=1767374160&width=900",
//     stock: 15,
//     category: "beauty-bodycare",
//     subCategory: "body-wash",
//     tags: ["eos", "body-wash", "moisturizing", "shea-butter"]
//   },
//   {
//     id: 10,
//     name: "EOS Body Wash (Jasmine Peach)",
//     description: "Apricot nectar, sparkling jasmine, and warm vanilla sugar blend into a sweet, sunlit scent that makes every wash feel fresh, smooth, and perfectly golden.",
//     price: 12.99,
//     image: "https://evolutionofsmooth.com/cdn/shop/files/bodywash_JP_MainPack_1000X1161_299a6b83-28b7-4ff9-8c87-47141097a263.jpg?v=1767374199&width=900",
//     stock: 15,
//     category: "beauty-bodycare",
//     subCategory: "body-wash",
//     tags: ["eos", "body-wash", "moisturizing", "shea-butter"]
//   },
//   {
//     id: 11,
//     name: "EOS Body Wash (Pomegranate Raspberry)",
//     description: "Luscious pomegranate, tart raspberry, and lotus blossom swirl into a juicy, radiant scent that makes every wash feel bright, fresh, and beautifully balanced.",
//     price: 12.99,
//     image: "https://evolutionofsmooth.com/cdn/shop/files/bodywash_PR_MainPack_1000X1161_15fca40f-1eb5-428c-b55a-a07bb898ed78.jpg?v=1767374110&width=900",
//     stock: 15,
//     category: "beauty-bodycare",
//     subCategory: "body-wash",
//     tags: ["eos", "body-wash", "moisturizing", "shea-butter"]
//   },
//   {
//     id: 12,
//     name: "EOS Body Wash (Vanilla Cashmere)",
//     description: "Whipped vanilla, soft musk, and caramel melt together in a sweet, creamy scent that makes every wash feel warm and comforting.",
//     price: 12.99,
//     image: "https://evolutionofsmooth.com/cdn/shop/files/BodyWash-VC-1000X1161.jpg?v=1763417523&width=900",
//     stock: 15,
//     category: "beauty-bodycare",
//     subCategory: "body-wash",
//     tags: ["eos", "body-wash", "moisturizing", "shea-butter"]
//   },
//   {
//     id: 13,
//     name: "EOS Body Wash (Pink Champagne)",
//     description: "Pear champagne, ruby pomegranate, and plum suede swirl into a bright, bubbly scent that leaves skin smooth, soft, and ready to celebrate.",
//     price: 12.99,
//     image: "https://evolutionofsmooth.com/cdn/shop/files/BodyWash-PC-1000X1161.jpg?v=1763417498&width=900",
//     stock: 15,
//     category: "beauty-bodycare",
//     subCategory: "body-wash",
//     tags: ["eos", "body-wash", "moisturizing", "shea-butter"]
//   },
//   {
//     id: 14,
//     name: "EOS Body Wash (Fresh & Cozy)",
//     description: "Morning light, dewy cassis, and sheer musk blend into a soft, airy scent that turns your daily wash into a calm, cozy reset.",
//     price: 12.99,
//     image: "https://evolutionofsmooth.com/cdn/shop/files/BodyWash-FC-1000X1161.jpg?v=1763417471&width=900",
//     stock: 15,
//     category: "beauty-bodycare",
//     subCategory: "body-wash",
//     tags: ["eos", "body-wash", "moisturizing", "shea-butter"]
//   },
//   {
//     //EOS BODY OIL
//     id: 15,
//     name: "EOS Cashmere Body Oil (Vanilla Cashmere)",
//     description: "A rich blend of whipped vanilla, soft musk, and caramel creates a smooth, comforting scent that melts into skin, leaving it soft and glowing.",
//     price: 18.99,
//     image: "https://evolutionofsmooth.com/cdn/shop/files/eos-body-oil-Vanilla-Cashmere.jpg?v=1737471443&width=900",
//     stock: 32,
//     category: "beauty-bodycare",
//     subCategory: "body-oil",
//     tags: ["eos", "body-oil", "cashmere", "luxury", "skin-care"]
//   },
//   {
//     id: 16,
//     name: "EOS Cashmere Whipped Oil Butter (Vanilla Cashmere)",
//     description: "A rich blend of whipped vanilla, soft musk, and caramel creates a smooth, comforting scent that hugs skin in lasting warmth. Sweet, creamy, and deeply indulgent.",
//     price: 22.99,
//     image: "https://evolutionofsmooth.com/cdn/shop/files/eos-body-Cashmere-Whipped-Oil-Butter.jpg?v=1737471797&width=900",
//     stock: 28,
//     category: "beauty-bodycare",
//     subCategory: "body-butter",
//     tags: ["eo", "body-butter", "whipped", "moisturizer", "cashmere"]
//   },

//   //DOVE Crumbl
//   {
//     id: 17,
//     name: "Dove Crumbl Confetti Cake (Body Wash)",
//     description: "Gentle cleansing for sensitive skin",
//     price: 8.99,
//     image: "https://i.ebayimg.com/images/g/DmIAAOSwzYFnavoW/s-l500.jpg",
//     stock: 60,
//     category: "beauty-bodycare",
//     subCategory: "body-wash",
//     tags: ["dove", "Body Wash", "cleansing", "sensitive-skin", "gentle"]
//   },
//   {
//     id: 18,
//     name: "Dove Crumbl Confetti Cake (Deoderant)",
//     description: "Deodorant of warm sugar cookie topped with pink buttercream frosting for your underarms,72-hour deodorant for odor protection",
//     price: 8.99,
//     image: "https://i5.walmartimages.com/asr/aca6b2ab-4891-4d6c-85f0-2546a9069536.67104bc68bd40241b6da67caa37a58fb.jpeg?odnHeight=2000&odnWidth=2000&odnBg=FFFFFF",
//     stock: 60,
//     category: "beauty-bodycare",
//     subCategory: "deodorant",
//     tags: ["dove", "Body Wash", "cleansing", "sensitive-skin", "gentle"]
//   },

//    // BATHROOM ESSENTIALS 
//   // ANNA Brand Bathroom sets 
//   {
//     id: 19,
//     name: "Anna 18 PC Embroidery Bath Set(Red)",
//     description: "Complete bathroom decor package, typically including a shower curtain, matching bath mat, contour rug, 12 shower curtain hooks, and a 3-piece towel set (bath, hand, washcloth), all featuring coordinated embroidery for a fresh look",
//     price: 49.99,
//     image: "https://www.annalinens.co/cdn/shop/products/18-piece-embroidery-banded-shower-curtain-bath-set-4806211.jpg?v=1759406843&width=1445",
//     stock: 18,
//     category: "bathroom-essentials",
//     subCategory: "bath-set",
//     tags: ["anna", "bath-set", "towels", "embroidery", "bathroom", "home"]
//   },
//    {
//     id: 20,
//     name: "Anna 18 PC Embroidery Bath Set(Pink)",
//     description: "Complete bathroom decor package, typically including a shower curtain, matching bath mat, contour rug, 12 shower curtain hooks, and a 3-piece towel set (bath, hand, washcloth), all featuring coordinated embroidery for a fresh look",
//     price: 49.99,
//     image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4PYxg2NSGqGdha3WOJlbymHF_L0mtQI9Y-Q&s",
//     stock: 18,
//     category: "bathroom-essentials",
//     subCategory: "bath-set",
//     tags: ["anna", "bath-set", "towels", "embroidery", "bathroom", "home"]
//   },

//    {
//     id: 21,
//     name: "Anna 18 PC Embroidery Bath Set(Purple)",
//     description: "Complete bathroom decor package, typically including a shower curtain, matching bath mat, contour rug, 12 shower curtain hooks, and a 3-piece towel set (bath, hand, washcloth), all featuring coordinated embroidery for a fresh look",
//     price: 49.99,
//     image: "https://www.annalinens.co/cdn/shop/products/18-piece-embroidery-banded-shower-curtain-bath-set-2407754.jpg?v=1759406844",
//     stock: 18,
//     category: "bathroom-essentials",
//     subCategory: "bath-set",
//     tags: ["anna", "bath-set", "towels", "embroidery", "bathroom", "home"]
//   },
//   {
//     id: 22,
//     name: "Anna 18 PC Embroidery Bath Set(Dark Blue)",
//     description: "Complete bathroom decor package, typically including a shower curtain, matching bath mat, contour rug, 12 shower curtain hooks, and a 3-piece towel set (bath, hand, washcloth), all featuring coordinated embroidery for a fresh look",
//     price: 49.99,
//     image: "https://shopbobbys.com/cdn/shop/files/image_f9bf1f44-5d04-41eb-b6b7-92ffd6119542_720x.jpg?v=1710800513",
//     stock: 18,
//     category: "bathroom-essentials",
//     subCategory: "bath-set",
//     tags: ["anna", "bath-set", "towels", "embroidery", "bathroom", "home"]
//   },
//  {
//     id: 23,
//     name: "Anna 18 PC Embroidery Bath Set(Grey)",
//     description: "Complete bathroom decor package, typically including a shower curtain, matching bath mat, contour rug, 12 shower curtain hooks, and a 3-piece towel set (bath, hand, washcloth), all featuring coordinated embroidery for a fresh look",
//     price: 49.99,
//     image: "https://shopbobbys.com/cdn/shop/files/image_881bc247-906d-4e5a-8936-2a41ccf1822e_720x.jpg?v=1710800508",
//     stock: 18,
//     category: "bathroom-essentials",
//     subCategory: "bath-set",
//     tags: ["anna", "bath-set", "towels", "embroidery", "bathroom", "home"]
//   },
//   {
//     id: 24,
//     name: "Anna 18 PC Embroidery Bath Set(Brown)",
//     description: "Complete bathroom decor package, typically including a shower curtain, matching bath mat, contour rug, 12 shower curtain hooks, and a 3-piece towel set (bath, hand, washcloth), all featuring coordinated embroidery for a fresh look",
//     price: 49.99,
//     image: "https://i5.walmartimages.com/seo/18-Pieces-Shower-Curtain-with-Matching-Fabric-Hook-Embroidery-Bath-Mat-Contour-Rug-and-Towel-Set_6a284929-d932-4a93-9de3-398b56582f99.2e0849176352328e890208b99258c3f0.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF",
//     stock: 18,
//     category: "bathroom-essentials",
//     subCategory: "bath-set",
//     tags: ["anna", "bath-set", "towels", "embroidery", "bathroom", "home"]
//   },


//    // HOME & LIVING 

//    // Scented Candles 
//   {
//     id: 27,
//     name: "Bath & Body Works(Covered in Roses) ",
//     description: "Scented Candle - It really makes a night in feel like a moment. Up to 45 hours of room-filling fragrance.​ Exclusively fragranced soy wax blend.​ Created with premium, lead-free wicks​.",
//     price: 14.99,
//     image: "https://www.bathandbodyworks.com/dw/image/v2/BBDL_PRD/on/demandware.static/-/Sites-master-catalog/default/dw3b9d8ca5/hires/028024774.jpg?sw=400&q=60",
//     stock: 55,
//     category: "home-living",
//     subCategory: "candles",
//     tags: ["Bath & Body Works ","Scented candles", "scented", "aromatherapy", "relaxation", "home-decor"]
//   },
//   {
//     id: 28,
//     name: "Bath & Body Works(Strawberry Pound Cake) ",
//     description: "Scented Candle - It's the fruity, creamy candle that shows your room some love. Up to 45 hours of room-filling fragrance.​ Exclusively fragranced soy wax blend.​ Created with premium, lead-free wicks​.",
//     price: 14.99,
//     image: "https://www.bathandbodyworks.com/dw/image/v2/BBDL_PRD/on/demandware.static/-/Sites-master-catalog/default/dwec2ba8f9/hires/028025715.jpg?sw=400&q=60",
//     stock: 55,
//     category: "home-living",
//     subCategory: "candles",
//     tags: ["Bath & Body Works ","Scented candles", "scented", "aromatherapy", "relaxation", "home-decor"]
//   },
//   {
//     id: 29,
//     name: "Bath & Body Works(Mahogany Vanilla) ",
//     description: "Scented Candle - It's a sweet, woodsy getaway in a jar. Up to 45 hours of room-filling fragrance.​ Exclusively fragranced soy wax blend.​ Created with premium, lead-free wicks​.",
//     price: 14.99,
//     image: "https://www.bathandbodyworks.com/dw/image/v2/BBDL_PRD/on/demandware.static/-/Sites-master-catalog/default/dw0d243cc3/hires/028025636.jpg?sw=400&q=60",
//     stock: 55,
//     category: "home-living",
//     subCategory: "candles",
//     tags: ["Bath & Body Works ","Scented candles", "scented", "aromatherapy", "relaxation", "home-decor"]
//   },
//   {
//     id: 30,
//     name: "Bath & Body Works(Vanilla Bean) ",
//     description: "Scented Candle - The cozy glow and sweet scent will make everyone feel right at home. Up to 45 hours of room-filling fragrance.​ Exclusively fragranced soy wax blend.​ Created with premium, lead-free wicks​.",
//     price: 14.99,
//     image: "https://www.bathandbodyworks.com/dw/image/v2/BBDL_PRD/on/demandware.static/-/Sites-master-catalog/default/dw21436417/hires/028024927.jpg?sw=400&q=60",
//     stock: 55,
//     category: "home-living",
//     subCategory: "candles",
//     tags: ["Bath & Body Works ","Scented candles", "scented", "aromatherapy", "relaxation", "home-decor"]
//   },
//   {
//     id: 31,
//     name: "Bath & Body Works(Mahogany Teakwood) ",
//     description: "Scented Candle - Sets the mood to woodsy and mysterious. Up to 45 hours of room-filling fragrance.​ Exclusively fragranced soy wax blend.​ Created with premium, lead-free wicks​.",
//     price: 14.99,
//     image: "https://www.bathandbodyworks.com/dw/image/v2/BBDL_PRD/on/demandware.static/-/Sites-master-catalog/default/dw92f08890/hires/028025605.jpg?sw=400&q=60",
//     stock: 55,
//     category: "home-living",
//     subCategory: "candles",
//     tags: ["Bath & Body Works ","Scented candles", "scented", "aromatherapy", "relaxation", "home-decor"]
//   },

//   {
//     id: 32,
//     name: "Bath & Body Works(Cinnamon Spiced Vanilla) ",
//     description: "Scented Candle - Delivers an amazing, room-filling fragrance experience. Up to 45 hours of room-filling fragrance.​ Exclusively fragranced soy wax blend.​ Created with premium, lead-free wicks​.",
//     price: 14.99,
//     image: "https://www.bathandbodyworks.com/dw/image/v2/BBDL_PRD/on/demandware.static/-/Sites-master-catalog/default/dwd9e8f12f/hires/028013567.jpg?sw=400&q=60",
//     stock: 55,
//     category: "home-living",
//     subCategory: "candles",
//     tags: ["Bath & Body Works ","Scented candles", "scented", "aromatherapy", "relaxation", "home-decor"]
//   },

  
//   //BED SHEETS 
// {
//     id: 33,
//     name: "Traditonal at Home 6pc Queen Sheet Set  (Baby Blue) ",
//     description: "Luxurious touch to your bedroom with this Traditional at Home 6pc Queen Sheet Set. The sheet set features an exquisite stripe print that will add elegance to any room. this sheet set is not only soft and comfortable but also durable and long-lasting. 1 Flat Sheet, 1 Fitted Sheet, 4 Standard Pillowcases,100% Wrinkle Free.",
//     price: 14.99,
//     image: "https://u-mercari-images.mercdn.net/photos/m32953402790_1.jpg",
//     stock: 55,
//     category: "home-living",
//     subCategory: "Bed Sheet",
//     tags: ["Bath & Body Works ","Scented candles", "scented", "aromatherapy", "relaxation", "home-decor"]
//   },
//   {
//     id: 34,
//     name: "Traditional at Home 6pc Queen Sheet Set (Shades of Orange striped Pattern) ",
//     description: "The queen-sized set features a beautiful shades of orange striped pattern that adds a touch of sophistication to any bedroom. Crafted from high-quality materials, the set is designed to be both deep-fitted and wrinkle-free, ensuring a comfortable and hassle-free experience every time you wash your sheets.1 Flat Sheet, 1 Fitted Sheet, 4 Standard Pillowcases,100% Wrinkle Free.",
//     price: 14.99,
//     image: "https://di2ponv0v5otw.cloudfront.net/posts/2025/10/19/68f4d49824b20bc373b57ac5/m_68f4d498955383ca2344d5aa.jpg",
//     stock: 55,
//     category: "home-living",
//     subCategory: "Bed Sheet",
//     tags: ["Bath & Body Works ","Scented candles", "scented", "aromatherapy", "relaxation", "home-decor"]
//   },
//   {
//     id: 35,
//     name: "Traditional at Home 6pc King Sheet Set (Taupe with White Stripes) ",
//     description: "This 6pc King Sheet Set from Transitional at Home features a luxurious stripe print, this set includes a fitted sheet with deep pockets, a flat sheet, and four pillowcases. The pattern adds a touch of elegance to any bedroom, while the machine washable feature provides easy maintenance. 1 Flat Sheet, 1 Fitted Sheet, 4 Standard Pillowcases,100% Wrinkle Free.",
//     price: 14.99,
//     image: "https://di2ponv0v5otw.cloudfront.net/posts/2025/08/25/68ad38b7dbd8f040d1b0a6f7/m_68ad38b821b8010d2bfe4abb.jpg",
//     stock: 55,
//     category: "home-living",
//     subCategory: "Bed Sheet",
//     tags: ["Bath & Body Works ","Scented candles", "scented", "aromatherapy", "relaxation", "home-decor"]
//   },
//   {
//     id: 36,
//     name: "Traditional at Home 6pc King Sheet Set (Blue with White Stripes) ",
//     description: "This 6pc King Sheet Set from Transitional at Home features a luxurious stripe print, this set includes a fitted sheet with deep pockets, a flat sheet, and four pillowcases. The pattern adds a touch of elegance to any bedroom, while the machine washable feature provides easy maintenance. 1 Flat Sheet, 1 Fitted Sheet, 4 Standard Pillowcases,100% Wrinkle Free.",
//     price: 14.99,
//     image: "https://u-mercari-images.mercdn.net/photos/m73496325896_1.jpg",
//     stock: 55,
//     category: "home-living",
//     subCategory: "Bed Sheet",
//     tags: ["Bath & Body Works ","Scented candles", "scented", "aromatherapy", "relaxation", "home-decor"]
//   },
//   {
//     id: 37,
//     name: "Traditional at Home 6pc King Sheet Set (Green Apple Embossed Stripes ",
//     description: "This 6-piece queen sheet set from Traditional at Home features a beautiful, embossed stipes print on a soft green apple background. The high-quality cotton percale a microfiber material ensures a luxurious sleeping experience, while the deep fitted sheet and thread count provide a secure and comfortable fit for your mattress. 1 Flat Sheet, 1 Fitted Sheet, 4 Standard Pillowcases,100% Wrinkle Free.",
//     price: 14.99,
//     image: "https://u-mercari-images.mercdn.net/photos/m16697942829_1.jpg",
//     stock: 55,
//     category: "home-living",
//     subCategory: "Bed Sheet",
//     tags: ["Bath & Body Works ","Scented candles", "scented", "aromatherapy", "relaxation", "home-decor"]
//   },
//   {
//     id: 38,
//     name: "Traditional at Home 6pc King Sheet Set (Snow White) ",
//     description: "This 6pc King Sheet Set from Transitional at Home features a solid color embossed striped print in a beautiful white color, perfect for a transitional or modern style. The deep fitted sheets are made with a breathable and machine washable fabric, ensuring comfort and easy maintenance. 1 Flat Sheet, 1 Fitted Sheet, 4 Standard Pillowcases,100% Wrinkle Free.",
//     price: 14.99,
//     image: "https://u-mercari-images.mercdn.net/photos/m73496325896_1.jpg",
//     stock: 55,
//     category: "home-living",
//     subCategory: "Bed Sheet",
//     tags: ["Bath & Body Works ","Scented candles", "scented", "aromatherapy", "relaxation", "home-decor"]
//   },


//   //FOOT-WEAR
//   {
//     id: 25,
//    name: "Old Navy Slides",
//   description: "Comfortable slippers for everyday wear",
//   price: 24.99,
//   image: "https://oldnavy.gap.com/webcontent/0028/509/243/cn28509243.jpg",
//   stock: 35,
//   category: "footwear",
//   subCategory: "Men",
//   tags: ["old-navy", "slippers", "comfort"],
//   sizes: ["6", "7", "8", "9", "10", "11"],
//   availableSizes: {
//     "6": 5,
//     "7": 8,
//     "8": 12,
//     "9": 10,
//     "10": 5,
//     "11": 2
//   }
//   },

//   {
//     id: 26,
//      name: "Old Navy Slides",
//   description: "Premium slippers and sandals for indoor and outdoor use",
//   price: 29.99,
//   image: "https://i.ebayimg.com/images/g/KcEAAeSw-NpooSXY/s-l1600.jpg",
//   stock: 42,
//   category: "footwear",
//   subCategory: "Women",
//   tags: ["rohue", "slippers", "sandals", "premium", "comfort"],
//   sizes: ["6", "7", "8", "9", "10", "11"],
//   availableSizes: {
//     "6": 5,
//     "7": 8,
//     "8": 12,
//     "9": 10,
//     "10": 5,
//     "11": 2
//   }
//   },
//  {
//   id: 39,
//   name: "YZE YS-01 Black Slides",
//   description: "Stylish black slides for casual summer wear",
//   price: 19.99,
//   image: "https://u-mercari-images.mercdn.net/photos/m67900688186_3.jpg",
//   stock: 48,
//   category: "footwear",
//   subCategory: "Men",
//   tags: ["yze", "slides", "black", "summer", "casual"],
//    sizes: ["6", "7", "8", "9", "10", "11"],
//   availableSizes: {   
//      "6": 5,
//     "7": 8,
//     "8": 12,
//     "9": 10,
//     "10": 5,
//     "11": 2
//   }
// },

// {
//     id: 40,
//      name: "Faux-Leather Slide Sandals",
//   description: "Premium slippers and sandals for indoor and outdoor use",
//   price: 29.99,
//   image: "https://oldnavy.gap.com/webcontent/0061/542/082/cn61542082.jpg",
//   stock: 42,
//   category: "footwear",
//   subCategory: "Women",
//   tags: ["rohue", "slippers", "sandals", "premium", "comfort"],
//   sizes: ["6", "7", "8", "9", "10", "11"],
//   availableSizes: {
//     "6": 5,
//     "7": 8,
//     "8": 12,
//     "9": 10,
//     "10": 5,
//     "11": 2
//   }
//   },
// {
//   id: 41,
//   name: "Rohue Slippers & Sandals",
//   description: "Premium slippers and sandals for indoor and outdoor use",
//   price: 29.99,
//   image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&h=500&fit=crop&auto=format",
//   stock: 42,
//   category: "footwear",
//   subCategory: "slippers",
//   tags: ["rohue", "slippers", "sandals", "premium", "comfort"],
//   sizes: ["6", "7", "8", "9", "10", "11"],
//   availableSizes: {
//     "6": 5,
//     "7": 8,
//     "8": 12,
//     "9": 10,
//     "10": 5,
//     "11": 2
//   }
// },

// // APPAREL - Add size selection for clothing
// {
//   id: 43,
//   name: "Aeropostale 87 Graphic Tee",
//   description: "Recycled Polyester | Crafted from a mix of pre- and post-consumer waste to help reduce landfills, Jersey knit, Screenprinted & rubberized logo text with large 87 graphic, Style: 6376, Imported",
//   price: 89.99,
//   image: "https://www.aeropostale.com/dw/image/v2/BBSG_PRD/on/demandware.static/-/Sites-master-catalog-aeropostale/default/dw7130c1e8/60016376_007_main.jpg?sw=968&sh=1116&sm=fit&sfrm=jpg",
//   stock: 30,
//   category: "apparel",
//   subCategory: "Men T's",
//   tags: ["old-navy", "slippers", "comfort"],
//   sizes: ["S", "M", "L", "XL"],
//   availableSizes: {
//     "S": 10,
//     "M": 12,
//     "L": 8,
//     "XL": 5
//   }
// },
// {
//   id: 44,
//   name: "Aero Pastel T-Shirts",
//   description: "Knit fabric, Tha Carter III album cover graphic, Style: 2137, Imported",
//   price: 16.99,
//   image: "https://www.aeropostale.com/dw/image/v2/BBSG_PRD/on/demandware.static/-/Sites-master-catalog-aeropostale/default/dw745ff9b2/60182137_001_main.jpg?sw=968&sh=1116&sm=fit&sfrm=jpg",
//   stock: 65,
//   category: "apparel",
//   subCategory: "Men T's",
//   tags: ["aero", "t-shirts", "cotton", "casual", "clothing"],
//   sizes: ["XS", "S", "M", "L", "XL", "XXL"],
//   availableSizes: {
//     "XS": 8,
//     "S": 12,
//     "M": 15,
//     "L": 12,
//     "XL": 10,
//     "XXL": 8
//   }
// },
// {
//   id: 45,
//   name: "Aero Queens NY Appliqué Graphic Tee",
//   description: "Classic button-up shirt for casual or business casual wear",
//   price: 29.99,
//   image: "https://www.aeropostale.com/dw/image/v2/BBSG_PRD/on/demandware.static/-/Sites-master-catalog-aeropostale/default/dwab3ecca1/60055593_102_main.jpg?sw=968&sh=1116&sm=fit&sfrm=jpg",
//   stock: 25,
//   category: "apparel",
//   subCategory: "Men T's",
//   tags: ["aero", "t-shirts", "cotton", "casual", "clothing"],
//   sizes: ["S", "M", "L", "XL", "XXL"],
//   availableSizes: {
//     "S": 5,
//     "M": 8,
//     "L": 7,
//     "XL": 3,
//     "XXL": 2
//   }
// },
// {
//   id: 46,
//   name: "Aero 1987 Glitter Graphic Tee",
//   description: "Recycled Polyester | Crafted from a mix of pre- and post-consumer waste to help reduce landfills, Jersey knit, Printed & glitter ink logo & butterfly graphics, Style: 7159, Imported",
//   price: 34.99,
//   image: "https://www.aeropostale.com/dw/image/v2/BBSG_PRD/on/demandware.static/-/Sites-master-catalog-aeropostale/default/dwed6f3005/80107159_007_main.jpg?sw=478&sh=557&sm=fit&sfrm=jpg",
//   stock: 20,
//   category: "apparel",
//   subCategory: "Women T's",
//  tags: ["aero", "t-shirts", "cotton", "casual", "clothing"],
//   sizes: ["XS", "S", "M", "L"],
//   availableSizes: {
//     "XS": 3,
//     "S": 6,
//     "M": 7,
//     "L": 4
//   }
// },
// {
//   id: 47,
//   name: "Aero Los Angeles Sequin Graphic Tee",
//   description: "Recycled Polyester | Crafted from a mix of pre- and post-consumer waste to help reduce landfills, Jersey knit, Logo text made with sequins + embroidered 1987 Los Angeles text, Style: 7150, Imported",
//   price: 39.99,
//   image: "https://www.aeropostale.com/dw/image/v2/BBSG_PRD/on/demandware.static/-/Sites-master-catalog-aeropostale/default/dw4c66faf6/80087150_665_main.jpg?sw=968&sh=1116&sm=fit&sfrm=jpg",
//   stock: 30,
//   category: "apparel",
//   subCategory: "Women T's",
//   tags: ["pants", "casual", "mens", "comfort", "everyday"],
//   sizes: ["30", "32", "34", "36", "38", "40"],
//   availableSizes: {
//     "30": 4,
//     "32": 6,
//     "34": 8,
//     "36": 7,
//     "38": 3,
//     "40": 2
//   }
// },
// {
//   id: 48,
//   name: "Essential Baggy Open-Hem Sweatpant",
//   description: "Comfortable sweatpants in our softAF fleece fabric and baggy-fit silhouette. Features open-hem cuffs, exterior drawcords, side pockets and one back pocket for extra storage. Imported.",
//   price: 24.99,
//   image: "https://img.abercrombie.com/is/image/anf/KIC_134-5087-00086-903_prod1?policy=product-medium",
//   stock: 40,
//   category: "apparel",
//   subCategory: "Men Bottom's",
//   tags: ["yoga", "leggings", "workout", "women", "activewear"],
//    sizes: ["30", "32", "34", "36", "38", "40"],
//   availableSizes: {
//     "30": 4,
//     "32": 6,
//     "34": 8,
//     "36": 7,
//     "38": 3,
//     "40": 2
//   }
// },



// // ELECTRONICS SECTION
// {
// id: 49,
// name: "iPhone 14 Pro",
// description: "Latest Apple iPhone with advanced camera features, A16 Bionic chip, and Super Retina XDR display",
// price: 999.99,
// image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop&auto=format",
// stock: 22,
// category: "electronics",
// subCategory: "smartphones",
// tags: ["apple", "iphone", "smartphone", "tech", "premium", "ios"]
// },
// {
// id: 50,
// name: "Samsung Galaxy S23",
// description: "Premium Android smartphone with advanced camera system and fast processor",
// price: 899.99,
// image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&h=500&fit=crop&auto=format",
// stock: 18,
// category: "electronics",
// subCategory: "smartphones",
// tags: ["samsung", "galaxy", "android", "smartphone", "5g"]
// },
// {
// id: 51,
// name: "Insignia 55-inch 4K Smart TV",
// description: "High-definition 4K television with smart features for home entertainment",
// price: 299.99,
// image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&h=500&fit=crop&auto=format",
// stock: 15,
// category: "electronics",
// subCategory: "televisions",
// tags: ["insignia", "tv", "television", "4k", "smart-tv", "entertainment"]
// },
// {
// id: 52,
// name: "Sony 65-inch 4K OLED TV",
// description: "Premium OLED television with exceptional picture quality and Dolby Atmos sound",
// price: 1499.99,
// image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&h=500&fit=crop&brightness=0.9",
// stock: 8,
// category: "electronics",
// subCategory: "televisions",
// tags: ["sony", "oled", "4k", "premium", "home-theater"]
// },
// {
// id: 53,
// name: "Apple MacBook Air M2",
// description: "Lightweight laptop with M2 chip, Retina display, and all-day battery life",
// price: 1099.99,
// image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop&auto=format",
// stock: 12,
// category: "electronics",
// subCategory: "laptops",
// tags: ["apple", "macbook", "laptop", "macos", "m2-chip"]
// },
// {
// id: 54,
// name: "Dell XPS 13 Laptop",
// description: "Ultra-thin laptop with InfinityEdge display and powerful performance",
// price: 999.99,
// image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop&auto=format",
// stock: 10,
// category: "electronics",
// subCategory: "laptops",
// tags: ["dell", "xps", "laptop", "windows", "ultrabook"]
// },
// {
// id: 55,
// name: "Apple iPad Air",
// description: "Versatile tablet with M1 chip, Liquid Retina display, and Apple Pencil support",
// price: 599.99,
// image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop&auto=format",
// stock: 25,
// category: "electronics",
// subCategory: "tablets",
// tags: ["apple", "ipad", "tablet", "ios", "portable"]
// },
// {
// id: 56,
// name: "Samsung Galaxy Tab S8",
// description: "Android tablet with S Pen, high refresh rate display, and powerful processor",
// price: 699.99,
// image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop&brightness=0.9",
// stock: 14,
// category: "electronics",
// subCategory: "tablets",
// tags: ["samsung", "galaxy-tab", "android", "tablet", "s-pen"]
// },
// {
// id: 57,
// name: "Sony WH-1000XM5 Headphones",
// description: "Premium noise-cancelling wireless headphones with exceptional sound quality",
// price: 399.99,
// image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop&auto=format",
// stock: 30,
// category: "electronics",
// subCategory: "headphones",
// tags: ["sony", "headphones", "wireless", "noise-cancelling", "audio"]
// },
// {
// id: 58,
// name: "Apple AirPods Pro",
// description: "Wireless earbuds with active noise cancellation and spatial audio",
// price: 249.99,
// image: "https://images.unsplash.com/photo-1599669454699-248893623440?w=500&h=500&fit=crop&auto=format",
// stock: 45,
// category: "electronics",
// subCategory: "earbuds",
// tags: ["apple", "airpods", "wireless", "earbuds", "noise-cancelling"]
// },
// {
// id: 59,
// name: "DJI Mini 3 Pro Drone",
// description: "Compact drone with 4K camera, obstacle sensing, and intelligent flight modes",
// price: 759.99,
// image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=500&h=500&fit=crop&auto=format",
// stock: 7,
// category: "electronics",
// subCategory: "drones",
// tags: ["dji", "drone", "camera", "4k", "aerial"]
// },
// {
// id: 60,
// name: "Nintendo Switch OLED",
// description: "Gaming console with OLED screen, hybrid home/portable design",
// price: 349.99,
// image: "https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=500&h=500&fit=crop&auto=format",
// stock: 20,
// category: "electronics",
// subCategory: "gaming",
// tags: ["nintendo", "switch", "gaming", "console", "oled"]
// },
// {
// id: 61,
// name: "PlayStation 5",
// description: "Next-generation gaming console with ultra-high speed SSD and ray tracing",
// price: 499.99,
// image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&h=500&fit=crop&auto=format",
// stock: 6,
// category: "electronics",
// subCategory: "gaming",
// tags: ["sony", "playstation", "ps5", "gaming", "console"]
// },
// {
// id: 62,
// name: "Xbox Series X",
// description: "Powerful gaming console with 4K gaming and backward compatibility",
// price: 499.99,
// image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&h=500&fit=crop&brightness=0.9",
// stock: 8,
// category: "electronics",
// subCategory: "gaming",
// tags: ["microsoft", "xbox", "gaming", "console", "4k"]
// }
// ];








// // Home Page Slides
// export const homeSlides = [
//   {
//     id: 1,
//     title: "EOS Products",
//     description: "EOS (Evolution of Smooth) is a beauty and skincare brand known for its brightly colored",
//     price: 89.99,
//     image: "https://evolutionofsmooth.com/cdn/shop/articles/Adobe_Express_-_file_-_2025-10-29T163614.508_0d060217-931e-4d27-9d0a-7d0269bc7825.jpg?crop=center&height=1000&v=1765212602&width=1000",
//     category: "beauty-bodycare"
//   },
//   {
//     id: 2,
//     title: "Dove Products",
//     description: "Dove products offer gentle, nourishing care for skin and hair",
//     price: 89.99,
//     image: "https://assets.unileversolutions.com/v1/143126630.jpg",
//     category: "beauty-bodycare"
//   },
//   {
//     id: 3,
//     title: "Silk Touch Lotion",
//     description: "Hydrating Body Cream - $34.99",
//     price: 34.99,
//     image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
//     category: "skincare"
//   },
//   {
//     id: 4,
//     title: "Velvet Rose",
//     description: "Floral Perfume Collection - $79.99",
//     price: 79.99,
//     image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
//     category: "perfume"
//   }
// ];

// // Featured Products (for the featured section on home page)
// export const featuredProducts = [
//   {
//     id: 57, // Using existing product IDs from your products array
//     title: "Noise-Cancelling Headphones",
//     description: "Over-ear headphones with premium sound quality",
//     price: 199.99,
//     image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
//     badge: "🔥 Hot Deal",
//     category: "electronics"
//   },
//   {
//     id: 27,
//     title: "Signature Perfume",
//     description: "Luxury floral fragrance with long-lasting scent",
//     price: 129.99,
//     image: "https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
//     badge: "✨ New",
//     category: "home-living"
//   },
//   {
//     id: 55,
//     title: "Smart Watch Series",
//     description: "Fitness tracker with ECG and GPS",
//     price: 249.99,
//     image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
//     badge: "💎 Premium",
//     category: "electronics"
//   }
// ];

// // Feature cards data
// export const featureCards = [
//   {
//     icon: "🚚",
//     title: "Free Shipping",
//     description: "Free delivery on orders over $75. Fast shipping nationwide."
//   },
//   {
//     icon: "💳",
//     title: "Easy Payment",
//     description: "Multiple payment options via WhatsApp confirmation."
//   },
//   {
//     icon: "🔄",
//     title: "30-Day Returns",
//     description: "Hassle-free returns within 30 days of purchase."
//   },
//   {
//     icon: "🛡️",
//     title: "Quality Guaranteed",
//     description: "Premium quality products with 100% satisfaction."
//   }
// ];

// // Hero stats data
// export const heroStats = [
//   { number: "500+", label: "Happy Customers" },
//   { number: "72+", label: "Premium Products" },
//   { number: "24/7", label: "Support" }
// ];






















































// data/MockData.ts

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  category: string;
  subCategory?: string;
  tags: string[];
  sizes?: string[];
  availableSizes?: Record<string, number>;
  // Admin-specific fields
  cost?: number;  // Cost price for profit calculation
  sku?: string;   // SKU for inventory tracking
}

// Your existing products array with enhanced fields for admin
export const products: Product[] = [
  // BEAUTY & BODY CARE 
  // EOS Products 
  {
    id: 1,
    name: "EOS Lotion (Vanilla)",
    description: "A rich blend of whipped vanilla, soft musk, and caramel creates a smooth, comforting scent that wraps skin in warmth. Sweet, creamy, and irresistible.",
    price: 12.99,
    cost: 7.50, // Added cost field
    sku: "EOS-LOT-001", // Added SKU
    image: "https://evolutionofsmooth.com/cdn/shop/files/VanillaCashmereBL_2.jpg?v=1758024162&width=900",
    stock: 15,
    category: "beauty-bodycare",
    subCategory: "lotion",
    tags: ["eos", "body-wash", "lotion", "moisturizing", "shea-butter"]
  },
  {
    id: 2,
    name: "EOS Lotion (Pink Champagne)",
    description: "With notes of pear champagne, ruby pomegranate, and plum suede, this bright, juicy scent feels crisp, playful, and elevated. It's a celebration for your skin.",
    price: 12.99,
    cost: 7.50,
    sku: "EOS-LOT-002",
    image: "https://evolutionofsmooth.com/cdn/shop/files/PinkChampagneBL.jpg?v=1758024243&width=900",
    stock: 45,
    category: "beauty-bodycare",
    subCategory: "lotion",
    tags: ["eos", "body-wash", "lotion", "moisturizing", "shea-butter"]
  },
  {
    id: 3,
    name: "EOS Lotion (Strawberry Dream)",
    description: "Featuring notes of sparkling strawberry, pink sugar, and vanilla cream, this rich, dreamy scent wraps your skin in sweet, creamy deliciousness.",
    price: 12.99,
    cost: 7.50,
    sku: "EOS-LOT-003",
    image: "https://evolutionofsmooth.com/cdn/shop/files/StrawberryDreamBL.jpg?v=1758024195&width=900",
    stock: 45,
    category: "beauty-bodycare",
    subCategory: "lotion",
    tags: ["eos", "body-wash", "lotion", "moisturizing", "shea-butter"]
  },
  {
    id: 4,
    name: "EOS Lotion (Fragrance Free)",
    description: "Gentle, fragrance-free hydration that soothes and strengthens extra-sensitive skin—leaving it soft, smooth, and calm.",
    price: 12.99,
    cost: 7.50,
    sku: "EOS-LOT-004",
    image: "https://evolutionofsmooth.com/cdn/shop/files/Sensitive_Skin.jpg?v=1762353481&width=900",
    stock: 45,
    category: "beauty-bodycare",
    subCategory: "lotion",
    tags: ["eos", "body-wash", "lotion", "moisturizing", "shea-butter"]
  },
  {
    id: 5,
    name: "EOS Lotion (Creme de Pistachio)",
    description: "Toasted pistachio, decadent toffee, and warm woods come together in a rich, cozy scent that feels like creamy pistachio gelato—elevated, indulgent, and impossible to resist.",
    price: 12.99,
    cost: 7.50,
    sku: "EOS-LOT-005",
    image: "https://evolutionofsmooth.com/cdn/shop/files/CremedePistachioBL.jpg?v=1758024334&width=900",
    stock: 45,
    category: "beauty-bodycare",
    subCategory: "lotion",
    tags: ["eos", "body-wash", "lotion", "moisturizing", "shea-butter"]
  },
  {
    id: 6,
    name: "EOS Lotion (Jasmine Peach)",
    description: "Apricot nectar, sparkling jasmine, and warm vanilla sugar blend into a bright, juicy scent that’s fresh, smooth, and perfectly balanced.",
    price: 12.99,
    cost: 7.50,
    sku: "EOS-LOT-006",
    image: "https://evolutionofsmooth.com/cdn/shop/files/JasminePeachBL.jpg?v=1758024265&width=900",
    stock: 45,
    category: "beauty-bodycare",
    subCategory: "lotion",
    tags: ["eos", "body-wash", "lotion", "moisturizing", "shea-butter"]
  },
  {
    id: 7,
    name: "EOS Lotion (Fresh + Cozy)",
    description: "Morning light, dewy cassis, and sheer musk blend into a soft, airy scent that feels calm, cozy, and effortlessly fresh.",
    price: 12.99,
    cost: 7.50,
    sku: "EOS-LOT-007",
    image: "https://evolutionofsmooth.com/cdn/shop/files/Fresh_CozyBL.jpg?v=1758024288&width=900",
    stock: 45,
    category: "beauty-bodycare",
    subCategory: "lotion",
    tags: ["eos", "body-wash", "lotion", "moisturizing", "shea-butter"]
  },
  {
    id: 8,
    name: "EOS Body Wash (Strawberry Dream)",
    description: "Sparkling strawberry, pink sugar, and vanilla cream swirl into a rich, dreamy scent that makes every wash feel sweet, creamy, and totally delicious.",
    price: 12.99,
    cost: 7.50,
    sku: "EOS-BW-001",
    image: "https://evolutionofsmooth.com/cdn/shop/files/bodywash_SD_MainPack_1000X1161_3f960bbc-21bf-4486-ba2a-2293c0dd77e9.jpg?v=1767374064&width=900",
    stock: 15,
    category: "beauty-bodycare",
    subCategory: "body-wash",
    tags: ["eos", "body-wash", "moisturizing", "shea-butter"]
  },
  {
    id: 9,
    name: "EOS Body Wash (Creme de Pistachio)",
    description: "Toasted pistachio, vanilla toffee, and warm woods melt into a rich, cozy scent that makes every wash feel creamy, decadent, and totally indulgent.",
    price: 12.99,
    cost: 7.50,
    sku: "EOS-BW-002",
    image: "https://evolutionofsmooth.com/cdn/shop/files/bodywash_P_MainPack_1000X1161_cc910c84-61dd-4ac6-9203-76b5663bf7df.jpg?v=1767374160&width=900",
    stock: 15,
    category: "beauty-bodycare",
    subCategory: "body-wash",
    tags: ["eos", "body-wash", "moisturizing", "shea-butter"]
  },
  {
    id: 10,
    name: "EOS Body Wash (Jasmine Peach)",
    description: "Apricot nectar, sparkling jasmine, and warm vanilla sugar blend into a sweet, sunlit scent that makes every wash feel fresh, smooth, and perfectly golden.",
    price: 12.99,
    cost: 7.50,
    sku: "EOS-BW-003",
    image: "https://evolutionofsmooth.com/cdn/shop/files/bodywash_JP_MainPack_1000X1161_299a6b83-28b7-4ff9-8c87-47141097a263.jpg?v=1767374199&width=900",
    stock: 15,
    category: "beauty-bodycare",
    subCategory: "body-wash",
    tags: ["eos", "body-wash", "moisturizing", "shea-butter"]
  },
  {
    id: 11,
    name: "EOS Body Wash (Pomegranate Raspberry)",
    description: "Luscious pomegranate, tart raspberry, and lotus blossom swirl into a juicy, radiant scent that makes every wash feel bright, fresh, and beautifully balanced.",
    price: 12.99,
    cost: 7.50,
    sku: "EOS-BW-004",
    image: "https://evolutionofsmooth.com/cdn/shop/files/bodywash_PR_MainPack_1000X1161_15fca40f-1eb5-428c-b55a-a07bb898ed78.jpg?v=1767374110&width=900",
    stock: 15,
    category: "beauty-bodycare",
    subCategory: "body-wash",
    tags: ["eos", "body-wash", "moisturizing", "shea-butter"]
  },
  {
    id: 12,
    name: "EOS Body Wash (Vanilla Cashmere)",
    description: "Whipped vanilla, soft musk, and caramel melt together in a sweet, creamy scent that makes every wash feel warm and comforting.",
    price: 12.99,
    cost: 7.50,
    sku: "EOS-BW-005",
    image: "https://evolutionofsmooth.com/cdn/shop/files/BodyWash-VC-1000X1161.jpg?v=1763417523&width=900",
    stock: 15,
    category: "beauty-bodycare",
    subCategory: "body-wash",
    tags: ["eos", "body-wash", "moisturizing", "shea-butter"]
  },
  {
    id: 13,
    name: "EOS Body Wash (Pink Champagne)",
    description: "Pear champagne, ruby pomegranate, and plum suede swirl into a bright, bubbly scent that leaves skin smooth, soft, and ready to celebrate.",
    price: 12.99,
    cost: 7.50,
    sku: "EOS-BW-006",
    image: "https://evolutionofsmooth.com/cdn/shop/files/BodyWash-PC-1000X1161.jpg?v=1763417498&width=900",
    stock: 15,
    category: "beauty-bodycare",
    subCategory: "body-wash",
    tags: ["eos", "body-wash", "moisturizing", "shea-butter"]
  },
  {
    id: 14,
    name: "EOS Body Wash (Fresh & Cozy)",
    description: "Morning light, dewy cassis, and sheer musk blend into a soft, airy scent that turns your daily wash into a calm, cozy reset.",
    price: 12.99,
    cost: 7.50,
    sku: "EOS-BW-007",
    image: "https://evolutionofsmooth.com/cdn/shop/files/BodyWash-FC-1000X1161.jpg?v=1763417471&width=900",
    stock: 15,
    category: "beauty-bodycare",
    subCategory: "body-wash",
    tags: ["eos", "body-wash", "moisturizing", "shea-butter"]
  },
  {
    id: 15,
    name: "EOS Cashmere Body Oil (Vanilla Cashmere)",
    description: "A rich blend of whipped vanilla, soft musk, and caramel creates a smooth, comforting scent that melts into skin, leaving it soft and glowing.",
    price: 18.99,
    cost: 11.50,
    sku: "EOS-OIL-001",
    image: "https://evolutionofsmooth.com/cdn/shop/files/eos-body-oil-Vanilla-Cashmere.jpg?v=1737471443&width=900",
    stock: 32,
    category: "beauty-bodycare",
    subCategory: "body-oil",
    tags: ["eos", "body-oil", "cashmere", "luxury", "skin-care"]
  },
  {
    id: 16,
    name: "EOS Cashmere Whipped Oil Butter (Vanilla Cashmere)",
    description: "A rich blend of whipped vanilla, soft musk, and caramel creates a smooth, comforting scent that hugs skin in lasting warmth. Sweet, creamy, and deeply indulgent.",
    price: 22.99,
    cost: 14.50,
    sku: "EOS-BUT-001",
    image: "https://evolutionofsmooth.com/cdn/shop/files/eos-body-Cashmere-Whipped-Oil-Butter.jpg?v=1737471797&width=900",
    stock: 28,
    category: "beauty-bodycare",
    subCategory: "body-butter",
    tags: ["eo", "body-butter", "whipped", "moisturizer", "cashmere"]
  },
  {
    id: 17,
    name: "Dove Crumbl Confetti Cake (Body Wash)",
    description: "Gentle cleansing for sensitive skin",
    price: 8.99,
    cost: 5.50,
    sku: "DOVE-BW-001",
    image: "https://i.ebayimg.com/images/g/DmIAAOSwzYFnavoW/s-l500.jpg",
    stock: 60,
    category: "beauty-bodycare",
    subCategory: "body-wash",
    tags: ["dove", "Body Wash", "cleansing", "sensitive-skin", "gentle"]
  },
  {
    id: 18,
    name: "Dove Crumbl Confetti Cake (Deodorant)",
    description: "Deodorant of warm sugar cookie topped with pink buttercream frosting for your underarms,72-hour deodorant for odor protection",
    price: 8.99,
    cost: 5.50,
    sku: "DOVE-DEO-001",
    image: "https://i5.walmartimages.com/asr/aca6b2ab-4891-4d6c-85f0-2546a9069536.67104bc68bd40241b6da67caa37a58fb.jpeg?odnHeight=2000&odnWidth=2000&odnBg=FFFFFF",
    stock: 60,
    category: "beauty-bodycare",
    subCategory: "deodorant",
    tags: ["dove", "Body Wash", "cleansing", "sensitive-skin", "gentle"]
  },
  {
    id: 19,
    name: "Anna 18 PC Embroidery Bath Set(Red)",
    description: "Complete bathroom decor package, typically including a shower curtain, matching bath mat, contour rug, 12 shower curtain hooks, and a 3-piece towel set (bath, hand, washcloth), all featuring coordinated embroidery for a fresh look",
    price: 49.99,
    cost: 30.00,
    sku: "ANNA-BATH-001",
    image: "https://www.annalinens.co/cdn/shop/products/18-piece-embroidery-banded-shower-curtain-bath-set-4806211.jpg?v=1759406843&width=1445",
    stock: 18,
    category: "bathroom-essentials",
    subCategory: "bath-set",
    tags: ["anna", "bath-set", "towels", "embroidery", "bathroom", "home"]
  },
  {
    id: 20,
    name: "Anna 18 PC Embroidery Bath Set(Pink)",
    description: "Complete bathroom decor package, typically including a shower curtain, matching bath mat, contour rug, 12 shower curtain hooks, and a 3-piece towel set (bath, hand, washcloth), all featuring coordinated embroidery for a fresh look",
    price: 49.99,
    cost: 30.00,
    sku: "ANNA-BATH-002",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4PYxg2NSGqGdha3WOJlbymHF_L0mtQI9Y-Q&s",
    stock: 18,
    category: "bathroom-essentials",
    subCategory: "bath-set",
    tags: ["anna", "bath-set", "towels", "embroidery", "bathroom", "home"]
  },
  {
    id: 21,
    name: "Anna 18 PC Embroidery Bath Set(Purple)",
    description: "Complete bathroom decor package, typically including a shower curtain, matching bath mat, contour rug, 12 shower curtain hooks, and a 3-piece towel set (bath, hand, washcloth), all featuring coordinated embroidery for a fresh look",
    price: 49.99,
    cost: 30.00,
    sku: "ANNA-BATH-003",
    image: "https://www.annalinens.co/cdn/shop/products/18-piece-embroidery-banded-shower-curtain-bath-set-2407754.jpg?v=1759406844",
    stock: 18,
    category: "bathroom-essentials",
    subCategory: "bath-set",
    tags: ["anna", "bath-set", "towels", "embroidery", "bathroom", "home"]
  },
  {
    id: 22,
    name: "Anna 18 PC Embroidery Bath Set(Dark Blue)",
    description: "Complete bathroom decor package, typically including a shower curtain, matching bath mat, contour rug, 12 shower curtain hooks, and a 3-piece towel set (bath, hand, washcloth), all featuring coordinated embroidery for a fresh look",
    price: 49.99,
    cost: 30.00,
    sku: "ANNA-BATH-004",
    image: "https://shopbobbys.com/cdn/shop/files/image_f9bf1f44-5d04-41eb-b6b7-92ffd6119542_720x.jpg?v=1710800513",
    stock: 18,
    category: "bathroom-essentials",
    subCategory: "bath-set",
    tags: ["anna", "bath-set", "towels", "embroidery", "bathroom", "home"]
  },
  {
    id: 23,
    name: "Anna 18 PC Embroidery Bath Set(Grey)",
    description: "Complete bathroom decor package, typically including a shower curtain, matching bath mat, contour rug, 12 shower curtain hooks, and a 3-piece towel set (bath, hand, washcloth), all featuring coordinated embroidery for a fresh look",
    price: 49.99,
    cost: 30.00,
    sku: "ANNA-BATH-005",
    image: "https://shopbobbys.com/cdn/shop/files/image_881bc247-906d-4e5a-8936-2a41ccf1822e_720x.jpg?v=1710800508",
    stock: 18,
    category: "bathroom-essentials",
    subCategory: "bath-set",
    tags: ["anna", "bath-set", "towels", "embroidery", "bathroom", "home"]
  },
  {
    id: 24,
    name: "Anna 18 PC Embroidery Bath Set(Brown)",
    description: "Complete bathroom decor package, typically including a shower curtain, matching bath mat, contour rug, 12 shower curtain hooks, and a 3-piece towel set (bath, hand, washcloth), all featuring coordinated embroidery for a fresh look",
    price: 49.99,
    cost: 30.00,
    sku: "ANNA-BATH-006",
    image: "https://i5.walmartimages.com/seo/18-Pieces-Shower-Curtain-with-Matching-Fabric-Hook-Embroidery-Bath-Mat-Contour-Rug-and-Towel-Set_6a284929-d932-4a93-9de3-398b56582f99.2e0849176352328e890208b99258c3f0.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF",
    stock: 18,
    category: "bathroom-essentials",
    subCategory: "bath-set",
    tags: ["anna", "bath-set", "towels", "embroidery", "bathroom", "home"]
  },
  {
    id: 25,
    name: "Old Navy Slides (Men)",
    description: "Comfortable slippers for everyday wear",
    price: 24.99,
    cost: 15.00,
    sku: "ON-SLD-001",
    image: "https://oldnavy.gap.com/webcontent/0028/509/243/cn28509243.jpg",
    stock: 35,
    category: "footwear",
    subCategory: "Men",
    tags: ["old-navy", "slippers", "comfort"],
    sizes: ["6", "7", "8", "9", "10", "11"],
    availableSizes: {
      "6": 5,
      "7": 8,
      "8": 12,
      "9": 10,
      "10": 5,
      "11": 2
    }
  },
  {
    id: 26,
    name: "Old Navy Slides (Women)",
    description: "Premium slippers and sandals for indoor and outdoor use",
    price: 29.99,
    cost: 18.00,
    sku: "ON-SLD-002",
    image: "https://i.ebayimg.com/images/g/KcEAAeSw-NpooSXY/s-l1600.jpg",
    stock: 42,
    category: "footwear",
    subCategory: "Women",
    tags: ["rohue", "slippers", "sandals", "premium", "comfort"],
    sizes: ["6", "7", "8", "9", "10", "11"],
    availableSizes: {
      "6": 5,
      "7": 8,
      "8": 12,
      "9": 10,
      "10": 5,
      "11": 2
    }
  },
  {
    id: 27,
    name: "Bath & Body Works (Covered in Roses)",
    description: "Scented Candle - It really makes a night in feel like a moment. Up to 45 hours of room-filling fragrance.​ Exclusively fragranced soy wax blend.​ Created with premium, lead-free wicks​.",
    price: 14.99,
    cost: 8.50,
    sku: "BBW-CAN-001",
    image: "https://www.bathandbodyworks.com/dw/image/v2/BBDL_PRD/on/demandware.static/-/Sites-master-catalog/default/dw3b9d8ca5/hires/028024774.jpg?sw=400&q=60",
    stock: 55,
    category: "home-living",
    subCategory: "candles",
    tags: ["Bath & Body Works", "Scented candles", "scented", "aromatherapy", "relaxation", "home-decor"]
  },
  {
    id: 28,
    name: "Bath & Body Works (Strawberry Pound Cake)",
    description: "Scented Candle - It's the fruity, creamy candle that shows your room some love. Up to 45 hours of room-filling fragrance.​ Exclusively fragranced soy wax blend.​ Created with premium, lead-free wicks​.",
    price: 14.99,
    cost: 8.50,
    sku: "BBW-CAN-002",
    image: "https://www.bathandbodyworks.com/dw/image/v2/BBDL_PRD/on/demandware.static/-/Sites-master-catalog/default/dwec2ba8f9/hires/028025715.jpg?sw=400&q=60",
    stock: 55,
    category: "home-living",
    subCategory: "candles",
    tags: ["Bath & Body Works", "Scented candles", "scented", "aromatherapy", "relaxation", "home-decor"]
  },
  {
    id: 29,
    name: "Bath & Body Works (Mahogany Vanilla)",
    description: "Scented Candle - It's a sweet, woodsy getaway in a jar. Up to 45 hours of room-filling fragrance.​ Exclusively fragranced soy wax blend.​ Created with premium, lead-free wicks​.",
    price: 14.99,
    cost: 8.50,
    sku: "BBW-CAN-003",
    image: "https://www.bathandbodyworks.com/dw/image/v2/BBDL_PRD/on/demandware.static/-/Sites-master-catalog/default/dw0d243cc3/hires/028025636.jpg?sw=400&q=60",
    stock: 55,
    category: "home-living",
    subCategory: "candles",
    tags: ["Bath & Body Works", "Scented candles", "scented", "aromatherapy", "relaxation", "home-decor"]
  },
  {
    id: 30,
    name: "Bath & Body Works (Vanilla Bean)",
    description: "Scented Candle - The cozy glow and sweet scent will make everyone feel right at home. Up to 45 hours of room-filling fragrance.​ Exclusively fragranced soy wax blend.​ Created with premium, lead-free wicks​.",
    price: 14.99,
    cost: 8.50,
    sku: "BBW-CAN-004",
    image: "https://www.bathandbodyworks.com/dw/image/v2/BBDL_PRD/on/demandware.static/-/Sites-master-catalog/default/dw21436417/hires/028024927.jpg?sw=400&q=60",
    stock: 55,
    category: "home-living",
    subCategory: "candles",
    tags: ["Bath & Body Works", "Scented candles", "scented", "aromatherapy", "relaxation", "home-decor"]
  },
  {
    id: 31,
    name: "Bath & Body Works (Mahogany Teakwood)",
    description: "Scented Candle - Sets the mood to woodsy and mysterious. Up to 45 hours of room-filling fragrance.​ Exclusively fragranced soy wax blend.​ Created with premium, lead-free wicks​.",
    price: 14.99,
    cost: 8.50,
    sku: "BBW-CAN-005",
    image: "https://www.bathandbodyworks.com/dw/image/v2/BBDL_PRD/on/demandware.static/-/Sites-master-catalog/default/dw92f08890/hires/028025605.jpg?sw=400&q=60",
    stock: 55,
    category: "home-living",
    subCategory: "candles",
    tags: ["Bath & Body Works", "Scented candles", "scented", "aromatherapy", "relaxation", "home-decor"]
  },
  {
    id: 32,
    name: "Bath & Body Works (Cinnamon Spiced Vanilla)",
    description: "Scented Candle - Delivers an amazing, room-filling fragrance experience. Up to 45 hours of room-filling fragrance.​ Exclusively fragranced soy wax blend.​ Created with premium, lead-free wicks​.",
    price: 14.99,
    cost: 8.50,
    sku: "BBW-CAN-006",
    image: "https://www.bathandbodyworks.com/dw/image/v2/BBDL_PRD/on/demandware.static/-/Sites-master-catalog/default/dwd9e8f12f/hires/028013567.jpg?sw=400&q=60",
    stock: 55,
    category: "home-living",
    subCategory: "candles",
    tags: ["Bath & Body Works", "Scented candles", "scented", "aromatherapy", "relaxation", "home-decor"]
  },
  {
    id: 33,
    name: "Traditional at Home 6pc Queen Sheet Set (Baby Blue)",
    description: "Luxurious touch to your bedroom with this Traditional at Home 6pc Queen Sheet Set. The sheet set features an exquisite stripe print that will add elegance to any room. this sheet set is not only soft and comfortable but also durable and long-lasting. 1 Flat Sheet, 1 Fitted Sheet, 4 Standard Pillowcases,100% Wrinkle Free.",
    price: 14.99,
    cost: 8.50,
    sku: "HOME-SHT-001",
    image: "https://u-mercari-images.mercdn.net/photos/m32953402790_1.jpg",
    stock: 55,
    category: "home-living",
    subCategory: "Bed Sheet",
    tags: ["Traditional at Home", "Bed sheets", "home-decor"]
  },
  {
    id: 34,
    name: "Traditional at Home 6pc Queen Sheet Set (Shades of Orange striped Pattern)",
    description: "The queen-sized set features a beautiful shades of orange striped pattern that adds a touch of sophistication to any bedroom. Crafted from high-quality materials, the set is designed to be both deep-fitted and wrinkle-free, ensuring a comfortable and hassle-free experience every time you wash your sheets.1 Flat Sheet, 1 Fitted Sheet, 4 Standard Pillowcases,100% Wrinkle Free.",
    price: 14.99,
    cost: 8.50,
    sku: "HOME-SHT-002",
    image: "https://di2ponv0v5otw.cloudfront.net/posts/2025/10/19/68f4d49824b20bc373b57ac5/m_68f4d498955383ca2344d5aa.jpg",
    stock: 55,
    category: "home-living",
    subCategory: "Bed Sheet",
    tags: ["Traditional at Home", "Bed sheets", "home-decor"]
  },
  {
    id: 35,
    name: "Traditional at Home 6pc King Sheet Set (Taupe with White Stripes)",
    description: "This 6pc King Sheet Set from Transitional at Home features a luxurious stripe print, this set includes a fitted sheet with deep pockets, a flat sheet, and four pillowcases. The pattern adds a touch of elegance to any bedroom, while the machine washable feature provides easy maintenance. 1 Flat Sheet, 1 Fitted Sheet, 4 Standard Pillowcases,100% Wrinkle Free.",
    price: 14.99,
    cost: 8.50,
    sku: "HOME-SHT-003",
    image: "https://di2ponv0v5otw.cloudfront.net/posts/2025/08/25/68ad38b7dbd8f040d1b0a6f7/m_68ad38b821b8010d2bfe4abb.jpg",
    stock: 55,
    category: "home-living",
    subCategory: "Bed Sheet",
    tags: ["Traditional at Home", "Bed sheets", "home-decor"]
  },
  {
    id: 36,
    name: "Traditional at Home 6pc King Sheet Set (Blue with White Stripes)",
    description: "This 6pc King Sheet Set from Transitional at Home features a luxurious stripe print, this set includes a fitted sheet with deep pockets, a flat sheet, and four pillowcases. The pattern adds a touch of elegance to any bedroom, while the machine washable feature provides easy maintenance. 1 Flat Sheet, 1 Fitted Sheet, 4 Standard Pillowcases,100% Wrinkle Free.",
    price: 14.99,
    cost: 8.50,
    sku: "HOME-SHT-004",
    image: "https://u-mercari-images.mercdn.net/photos/m73496325896_1.jpg",
    stock: 55,
    category: "home-living",
    subCategory: "Bed Sheet",
    tags: ["Traditional at Home", "Bed sheets", "home-decor"]
  },
  {
    id: 37,
    name: "Traditional at Home 6pc King Sheet Set (Green Apple Embossed Stripes)",
    description: "This 6-piece queen sheet set from Traditional at Home features a beautiful, embossed stipes print on a soft green apple background. The high-quality cotton percale a microfiber material ensures a luxurious sleeping experience, while the deep fitted sheet and thread count provide a secure and comfortable fit for your mattress. 1 Flat Sheet, 1 Fitted Sheet, 4 Standard Pillowcases,100% Wrinkle Free.",
    price: 14.99,
    cost: 8.50,
    sku: "HOME-SHT-005",
    image: "https://u-mercari-images.mercdn.net/photos/m16697942829_1.jpg",
    stock: 55,
    category: "home-living",
    subCategory: "Bed Sheet",
    tags: ["Traditional at Home", "Bed sheets", "home-decor"]
  },
  {
    id: 38,
    name: "Traditional at Home 6pc King Sheet Set (Snow White)",
    description: "This 6pc King Sheet Set from Transitional at Home features a solid color embossed striped print in a beautiful white color, perfect for a transitional or modern style. The deep fitted sheets are made with a breathable and machine washable fabric, ensuring comfort and easy maintenance. 1 Flat Sheet, 1 Fitted Sheet, 4 Standard Pillowcases,100% Wrinkle Free.",
    price: 14.99,
    cost: 8.50,
    sku: "HOME-SHT-006",
    image: "https://u-mercari-images.mercdn.net/photos/m73496325896_1.jpg",
    stock: 55,
    category: "home-living",
    subCategory: "Bed Sheet",
    tags: ["Traditional at Home", "Bed sheets", "home-decor"]
  },
  {
    id: 39,
    name: "YZE YS-01 Black Slides",
    description: "Stylish black slides for casual summer wear",
    price: 19.99,
    cost: 12.00,
    sku: "YZE-SLD-001",
    image: "https://u-mercari-images.mercdn.net/photos/m67900688186_3.jpg",
    stock: 48,
    category: "footwear",
    subCategory: "Men",
    tags: ["yze", "slides", "black", "summer", "casual"],
    sizes: ["6", "7", "8", "9", "10", "11"],
    availableSizes: {
      "6": 5,
      "7": 8,
      "8": 12,
      "9": 10,
      "10": 5,
      "11": 2
    }
  },
  {
    id: 40,
    name: "Faux-Leather Slide Sandals",
    description: "Premium slippers and sandals for indoor and outdoor use",
    price: 29.99,
    cost: 18.00,
    sku: "ON-SLD-003",
    image: "https://oldnavy.gap.com/webcontent/0061/542/082/cn61542082.jpg",
    stock: 42,
    category: "footwear",
    subCategory: "Women",
    tags: ["rohue", "slippers", "sandals", "premium", "comfort"],
    sizes: ["6", "7", "8", "9", "10", "11"],
    availableSizes: {
      "6": 5,
      "7": 8,
      "8": 12,
      "9": 10,
      "10": 5,
      "11": 2
    }
  },
  {
    id: 41,
    name: "Rohue Slippers & Sandals",
    description: "Premium slippers and sandals for indoor and outdoor use",
    price: 29.99,
    cost: 18.00,
    sku: "ROH-SLD-001",
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&h=500&fit=crop&auto=format",
    stock: 42,
    category: "footwear",
    subCategory: "slippers",
    tags: ["rohue", "slippers", "sandals", "premium", "comfort"],
    sizes: ["6", "7", "8", "9", "10", "11"],
    availableSizes: {
      "6": 5,
      "7": 8,
      "8": 12,
      "9": 10,
      "10": 5,
      "11": 2
    }
  },
  {
    id: 43,
    name: "Aeropostale 87 Graphic Tee",
    description: "Recycled Polyester | Crafted from a mix of pre- and post-consumer waste to help reduce landfills, Jersey knit, Screenprinted & rubberized logo text with large 87 graphic, Style: 6376, Imported",
    price: 89.99,
    cost: 45.00,
    sku: "AERO-TEE-001",
    image: "https://www.aeropostale.com/dw/image/v2/BBSG_PRD/on/demandware.static/-/Sites-master-catalog-aeropostale/default/dw7130c1e8/60016376_007_main.jpg?sw=968&sh=1116&sm=fit&sfrm=jpg",
    stock: 30,
    category: "apparel",
    subCategory: "Men T's",
    tags: ["old-navy", "slippers", "comfort"],
    sizes: ["S", "M", "L", "XL"],
    availableSizes: {
      "S": 10,
      "M": 12,
      "L": 8,
      "XL": 5
    }
  },
  {
    id: 44,
    name: "Aero Pastel T-Shirts",
    description: "Knit fabric, Tha Carter III album cover graphic, Style: 2137, Imported",
    price: 16.99,
    cost: 8.50,
    sku: "AERO-TEE-002",
    image: "https://www.aeropostale.com/dw/image/v2/BBSG_PRD/on/demandware.static/-/Sites-master-catalog-aeropostale/default/dw745ff9b2/60182137_001_main.jpg?sw=968&sh=1116&sm=fit&sfrm=jpg",
    stock: 65,
    category: "apparel",
    subCategory: "Men T's",
    tags: ["aero", "t-shirts", "cotton", "casual", "clothing"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    availableSizes: {
      "XS": 8,
      "S": 12,
      "M": 15,
      "L": 12,
      "XL": 10,
      "XXL": 8
    }
  },
  {
    id: 45,
    name: "Aero Queens NY Appliqué Graphic Tee",
    description: "Classic button-up shirt for casual or business casual wear",
    price: 29.99,
    cost: 15.00,
    sku: "AERO-TEE-003",
    image: "https://www.aeropostale.com/dw/image/v2/BBSG_PRD/on/demandware.static/-/Sites-master-catalog-aeropostale/default/dwab3ecca1/60055593_102_main.jpg?sw=968&sh=1116&sm=fit&sfrm=jpg",
    stock: 25,
    category: "apparel",
    subCategory: "Men T's",
    tags: ["aero", "t-shirts", "cotton", "casual", "clothing"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    availableSizes: {
      "S": 5,
      "M": 8,
      "L": 7,
      "XL": 3,
      "XXL": 2
    }
  },
  {
    id: 46,
    name: "Aero 1987 Glitter Graphic Tee",
    description: "Recycled Polyester | Crafted from a mix of pre- and post-consumer waste to help reduce landfills, Jersey knit, Printed & glitter ink logo & butterfly graphics, Style: 7159, Imported",
    price: 34.99,
    cost: 17.50,
    sku: "AERO-TEE-004",
    image: "https://www.aeropostale.com/dw/image/v2/BBSG_PRD/on/demandware.static/-/Sites-master-catalog-aeropostale/default/dwed6f3005/80107159_007_main.jpg?sw=478&sh=557&sm=fit&sfrm=jpg",
    stock: 20,
    category: "apparel",
    subCategory: "Women T's",
    tags: ["aero", "t-shirts", "cotton", "casual", "clothing"],
    sizes: ["XS", "S", "M", "L"],
    availableSizes: {
      "XS": 3,
      "S": 6,
      "M": 7,
      "L": 4
    }
  },
  {
    id: 47,
    name: "Aero Los Angeles Sequin Graphic Tee",
    description: "Recycled Polyester | Crafted from a mix of pre- and post-consumer waste to help reduce landfills, Jersey knit, Logo text made with sequins + embroidered 1987 Los Angeles text, Style: 7150, Imported",
    price: 39.99,
    cost: 20.00,
    sku: "AERO-TEE-005",
    image: "https://www.aeropostale.com/dw/image/v2/BBSG_PRD/on/demandware.static/-/Sites-master-catalog-aeropostale/default/dw4c66faf6/80087150_665_main.jpg?sw=968&sh=1116&sm=fit&sfrm=jpg",
    stock: 30,
    category: "apparel",
    subCategory: "Women T's",
    tags: ["pants", "casual", "mens", "comfort", "everyday"],
    sizes: ["30", "32", "34", "36", "38", "40"],
    availableSizes: {
      "30": 4,
      "32": 6,
      "34": 8,
      "36": 7,
      "38": 3,
      "40": 2
    }
  },
  {
    id: 48,
    name: "Essential Baggy Open-Hem Sweatpant",
    description: "Comfortable sweatpants in our softAF fleece fabric and baggy-fit silhouette. Features open-hem cuffs, exterior drawcords, side pockets and one back pocket for extra storage. Imported.",
    price: 24.99,
    cost: 12.50,
    sku: "AERO-PNT-001",
    image: "https://img.abercrombie.com/is/image/anf/KIC_134-5087-00086-903_prod1?policy=product-medium",
    stock: 40,
    category: "apparel",
    subCategory: "Men Bottom's",
    tags: ["yoga", "leggings", "workout", "women", "activewear"],
    sizes: ["30", "32", "34", "36", "38", "40"],
    availableSizes: {
      "30": 4,
      "32": 6,
      "34": 8,
      "36": 7,
      "38": 3,
      "40": 2
    }
  },
  {
    id: 49,
    name: "iPhone 14 Pro",
    description: "Latest Apple iPhone with advanced camera features, A16 Bionic chip, and Super Retina XDR display",
    price: 999.99,
    cost: 750.00,
    sku: "APP-IPH-001",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop&auto=format",
    stock: 22,
    category: "electronics",
    subCategory: "smartphones",
    tags: ["apple", "iphone", "smartphone", "tech", "premium", "ios"]
  },
  {
    id: 50,
    name: "Samsung Galaxy S23",
    description: "Premium Android smartphone with advanced camera system and fast processor",
    price: 899.99,
    cost: 675.00,
    sku: "SAM-GAL-001",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&h=500&fit=crop&auto=format",
    stock: 18,
    category: "electronics",
    subCategory: "smartphones",
    tags: ["samsung", "galaxy", "android", "smartphone", "5g"]
  },
  {
    id: 51,
    name: "Insignia 55-inch 4K Smart TV",
    description: "High-definition 4K television with smart features for home entertainment",
    price: 299.99,
    cost: 225.00,
    sku: "INS-TV-001",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&h=500&fit=crop&auto=format",
    stock: 15,
    category: "electronics",
    subCategory: "televisions",
    tags: ["insignia", "tv", "television", "4k", "smart-tv", "entertainment"]
  },
  {
    id: 52,
    name: "Sony 65-inch 4K OLED TV",
    description: "Premium OLED television with exceptional picture quality and Dolby Atmos sound",
    price: 1499.99,
    cost: 1125.00,
    sku: "SON-TV-001",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&h=500&fit=crop&brightness=0.9",
    stock: 8,
    category: "electronics",
    subCategory: "televisions",
    tags: ["sony", "oled", "4k", "premium", "home-theater"]
  },
  {
    id: 53,
    name: "Apple MacBook Air M2",
    description: "Lightweight laptop with M2 chip, Retina display, and all-day battery life",
    price: 1099.99,
    cost: 825.00,
    sku: "APP-MAC-001",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop&auto=format",
    stock: 12,
    category: "electronics",
    subCategory: "laptops",
    tags: ["apple", "macbook", "laptop", "macos", "m2-chip"]
  },
  {
    id: 54,
    name: "Dell XPS 13 Laptop",
    description: "Ultra-thin laptop with InfinityEdge display and powerful performance",
    price: 999.99,
    cost: 750.00,
    sku: "DEL-XPS-001",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop&auto=format",
    stock: 10,
    category: "electronics",
    subCategory: "laptops",
    tags: ["dell", "xps", "laptop", "windows", "ultrabook"]
  },
  {
    id: 55,
    name: "Apple iPad Air",
    description: "Versatile tablet with M1 chip, Liquid Retina display, and Apple Pencil support",
    price: 599.99,
    cost: 450.00,
    sku: "APP-IPD-001",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop&auto=format",
    stock: 25,
    category: "electronics",
    subCategory: "tablets",
    tags: ["apple", "ipad", "tablet", "ios", "portable"]
  },
  {
    id: 56,
    name: "Samsung Galaxy Tab S8",
    description: "Android tablet with S Pen, high refresh rate display, and powerful processor",
    price: 699.99,
    cost: 525.00,
    sku: "SAM-TAB-001",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop&brightness=0.9",
    stock: 14,
    category: "electronics",
    subCategory: "tablets",
    tags: ["samsung", "galaxy-tab", "android", "tablet", "s-pen"]
  },
  {
    id: 57,
    name: "Sony WH-1000XM5 Headphones",
    description: "Premium noise-cancelling wireless headphones with exceptional sound quality",
    price: 399.99,
    cost: 300.00,
    sku: "SON-HP-001",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop&auto=format",
    stock: 30,
    category: "electronics",
    subCategory: "headphones",
    tags: ["sony", "headphones", "wireless", "noise-cancelling", "audio"]
  },
  {
    id: 58,
    name: "Apple AirPods Pro",
    description: "Wireless earbuds with active noise cancellation and spatial audio",
    price: 249.99,
    cost: 187.50,
    sku: "APP-AIR-001",
    image: "https://images.unsplash.com/photo-1599669454699-248893623440?w=500&h=500&fit=crop&auto=format",
    stock: 45,
    category: "electronics",
    subCategory: "earbuds",
    tags: ["apple", "airpods", "wireless", "earbuds", "noise-cancelling"]
  },
  {
    id: 59,
    name: "DJI Mini 3 Pro Drone",
    description: "Compact drone with 4K camera, obstacle sensing, and intelligent flight modes",
    price: 759.99,
    cost: 570.00,
    sku: "DJI-DRN-001",
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=500&h=500&fit=crop&auto=format",
    stock: 7,
    category: "electronics",
    subCategory: "drones",
    tags: ["dji", "drone", "camera", "4k", "aerial"]
  },
  {
    id: 60,
    name: "Nintendo Switch OLED",
    description: "Gaming console with OLED screen, hybrid home/portable design",
    price: 349.99,
    cost: 262.50,
    sku: "NIN-SWT-001",
    image: "https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=500&h=500&fit=crop&auto=format",
    stock: 20,
    category: "electronics",
    subCategory: "gaming",
    tags: ["nintendo", "switch", "gaming", "console", "oled"]
  },
  {
    id: 61,
    name: "PlayStation 5",
    description: "Next-generation gaming console with ultra-high speed SSD and ray tracing",
    price: 499.99,
    cost: 375.00,
    sku: "SON-PS5-001",
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&h=500&fit=crop&auto=format",
    stock: 6,
    category: "electronics",
    subCategory: "gaming",
    tags: ["sony", "playstation", "ps5", "gaming", "console"]
  },
  {
    id: 62,
    name: "Xbox Series X",
    description: "Powerful gaming console with 4K gaming and backward compatibility",
    price: 499.99,
    cost: 375.00,
    sku: "MIC-XBX-001",
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&h=500&fit=crop&brightness=0.9",
    stock: 8,
    category: "electronics",
    subCategory: "gaming",
    tags: ["microsoft", "xbox", "gaming", "console", "4k"]
  }
];

// Home Page Slides
export const homeSlides = [
  {
    id: 1,
    title: "EOS Products",
    description: "EOS (Evolution of Smooth) is a beauty and skincare brand known for its brightly colored",
    price: 89.99,
    image: "https://evolutionofsmooth.com/cdn/shop/articles/Adobe_Express_-_file_-_2025-10-29T163614.508_0d060217-931e-4d27-9d0a-7d0269bc7825.jpg?crop=center&height=1000&v=1765212602&width=1000",
    category: "beauty-bodycare"
  },
  {
    id: 2,
    title: "Dove Products",
    description: "Dove products offer gentle, nourishing care for skin and hair",
    price: 89.99,
    image: "https://assets.unileversolutions.com/v1/143126630.jpg",
    category: "beauty-bodycare"
  },
  {
    id: 3,
    title: "Silk Touch Lotion",
    description: "Hydrating Body Cream - $34.99",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    category: "skincare"
  },
  {
    id: 4,
    title: "Velvet Rose",
    description: "Floral Perfume Collection - $79.99",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    category: "perfume"
  }
];

// Featured Products (for the featured section on home page)
export const featuredProducts = [
  {
    id: 57,
    title: "Noise-Cancelling Headphones",
    description: "Over-ear headphones with premium sound quality",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    badge: "🔥 Hot Deal",
    category: "electronics"
  },
  {
    id: 27,
    title: "Signature Perfume",
    description: "Luxury floral fragrance with long-lasting scent",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    badge: "✨ New",
    category: "home-living"
  },
  {
    id: 55,
    title: "Smart Watch Series",
    description: "Fitness tracker with ECG and GPS",
    price: 249.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    badge: "💎 Premium",
    category: "electronics"
  }
];

// Feature cards data
export const featureCards = [
  {
    icon: "🚚",
    title: "Free Shipping",
    description: "Free delivery on orders over $75. Fast shipping nationwide."
  },
  {
    icon: "💳",
    title: "Easy Payment",
    description: "Multiple payment options via WhatsApp confirmation."
  },
  {
    icon: "🔄",
    title: "30-Day Returns",
    description: "Hassle-free returns within 30 days of purchase."
  },
  {
    icon: "🛡️",
    title: "Quality Guaranteed",
    description: "Premium quality products with 100% satisfaction."
  }
];

// Hero stats data
export const heroStats = [
  { number: "500+", label: "Happy Customers" },
  { number: "72+", label: "Premium Products" },
  { number: "24/7", label: "Support" }
];