const food_data = [
  {
    title: "Grilled Chicken Burger",
    desc: "Features a grilled chicken breast, often seasoned with herbs and spices, offering a healthier, leaner alternative to fried chicken.",
    price: "23.79",
    image:
      "https://i.pinimg.com/564x/a3/df/2b/a3df2b6a360437a34487b68e4a9f5aa9.jpg",
    discount: "1.10",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 9,
  },
  {
    title: "Crispy Fried Chicken Burger",
    desc: "Consists of a battered and deep-fried chicken breast, providing a crunchy texture and rich flavor.",
    price: "19.99",
    image:
      "https://i.pinimg.com/564x/57/b1/f6/57b1f661f15c329c01ac21424f1fb477.jpg",
    discount: "0",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 9,
  },
  {
    title: "Spicy Chicken Burger",
    desc: "Infused with spicy elements like hot sauce, cajun seasoning, or jalapeos, added either in the marinade or as toppings for extra heat.",
    price: "27.45",
    image:
      "https://i.pinimg.com/564x/0f/83/3f/0f833f4b0ff0f4b0772776d2ed783eaf.jpg",
    discount: "1.30",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 9,
  },
  {
    title: "BBQ Chicken Burger",
    desc: "Topped with barbecue sauce, this burger might also include ingredients like crispy onions or coleslaw to complement the smoky BBQ flavor.",
    price: "18.60",
    image:
      "https://i.pinimg.com/564x/0c/4e/c2/0c4ec2dc9bd6acf9f2ad9d4285acf357.jpg",
    discount: "0.50",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 9,
  },
  {
    title: "Teriyaki Chicken Burger",
    desc: "Marinated in teriyaki sauce and typically topped with grilled pineapple or Asian slaw, offering a sweet and savory taste profile.",
    price: "20.99",
    image:
      "https://i.pinimg.com/564x/d2/4b/9d/d24b9d5f3f445bea9a0214aef067bbf9.jpg",
    discount: "0",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 9,
  },
  {
    title: "Truffle Burger",
    desc: "Features a beef patty with truffle-infused cheese or truffle aioli, often accompanied by gourmet mushrooms, offering a luxurious and rich flavor.",
    price: "29.99",
    image:
      "https://i.pinimg.com/564x/ed/56/d9/ed56d9a85bf81a234fd87979f07bc8ba.jpg",
    discount: "0.85",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 10,
  },
  {
    title: "Blue Cheese and Caramelized Onion Burger",
    desc: "Topped with tangy blue cheese and sweet caramelized onions, this burger offers a sophisticated blend of flavors.",
    price: "26.50",
    image:
      "https://i.pinimg.com/564x/17/53/5c/17535cff0cc44fe8d14b09382b8ce9df.jpg",
    discount: "0",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 10,
  },
  {
    title: "Brie and Fig Burger",
    desc: "Combines creamy brie cheese with sweet fig jam or fresh figs, adding an elegant and unique taste to the classic burger.",
    price: "27.80",
    image:
      "https://i.pinimg.com/564x/84/bb/e5/84bbe59def852ebe9ecd2acb984bfbac.jpg",
    discount: "0",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 10,
  },
  {
    title: "Wagyu Beef Burger",
    desc: "Made with high-quality Wagyu beef, known for its intense marbling and flavor, often simply seasoned to let the meat shine.",
    price: "31.90",
    image:
      "https://i.pinimg.com/564x/2c/bb/97/2cbb97c84d1f0458dfeb45732c80660c.jpg",
    discount: "1.50",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 10,
  },
  {
    title: "Lamb Burger with Feta and Mint",
    desc: "Utilizes ground lamb for the patty, topped with crumbled feta cheese and a mint sauce or pesto, offering a Mediterranean-inspired flavor.",
    price: "24.40",
    image:
      "https://i.pinimg.com/564x/87/2a/97/872a97a8e1eb6b8d410300429e983bd0.jpg",
    discount: "0",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 10,
  },
  {
    title: "Creamy Tomato Basil Soup",
    desc: "Blended with cream or milk and flavored with fresh basil, offering a smooth and rich taste.",
    price: "15.99",
    image:
      "https://i.pinimg.com/564x/78/c6/7a/78c67a619bc0cd9f832964125264fdee.jpg",
    discount: "0.50",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 11,
  },
  {
    title: "Roasted Tomato Soup",
    desc: "Features tomatoes that have been roasted to enhance their sweetness and depth of flavor, often combined with roasted garlic.",
    price: "16.20",
    image:
      "https://i.pinimg.com/564x/2e/c6/5f/2ec65fe6d331dbe78d8b8bb655390020.jpg",
    discount: "0",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 11,
  },
  {
    title: "Tomato and Red Pepper Soup",
    desc: "Combines tomatoes with roasted red peppers, adding a slightly sweet and smoky flavor to the soup.",
    price: "17.50",
    image:
      "https://i.pinimg.com/564x/45/40/18/454018142aec219f7d622a062e78c79d.jpg",
    discount: "0",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 11,
  },
  {
    title: "Spicy Tomato Soup",
    desc: "Infused with spices like cayenne pepper or red chili flakes, adding a warm and spicy kick to the classic tomato soup.",
    price: "18.30",
    image:
      "https://i.pinimg.com/564x/a6/b3/1e/a6b31e2b0d22f61ccd846a5e4ac2c5ac.jpg",
    discount: "0.90",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 11,
  },
  {
    title: "Tomato and Tortellini Soup",
    desc: "Includes cheese or meat-filled tortellini, making it a more filling meal, often accompanied by spinach or other greens.",
    price: "19.75",
    image:
      "https://i.pinimg.com/564x/83/db/5e/83db5ec58a2a973a55a64303dee9e451.jpg",
    discount: "0",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 11,
  },
  {
    title: "Classic Chicken Noodle Soup",
    desc: "Made with chicken broth, chunks of chicken, noodles, and a mix of vegetables like carrots, celery, and onions.",
    price: "16.99",
    image:
      "https://i.pinimg.com/736x/66/aa/29/66aa2953471217472f0190ff478421a8.jpg",
    discount: "0",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 12,
  },
  {
    title: "Asian-Inspired Chicken Noodle Soup",
    desc: "Incorporates ingredients like ginger, lemongrass, and bok choy, often using rice noodles and a splash of soy sauce or sesame oil for an Asian twist.",
    price: "18.45",
    image:
      "https://i.pinimg.com/564x/e9/ee/05/e9ee0576f49ed3da9364fc594796357c.jpg",
    discount: "0.55",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 12,
  },
  {
    title: "Creamy Chicken Noodle Soup",
    desc: "Adds cream or a roux to the traditional recipe, resulting in a richer, thicker broth.",
    price: "17.20",
    image:
      "https://i.pinimg.com/564x/4d/4e/71/4d4e71063a2c55127cf79da1bb26a0c4.jpg",
    discount: "0",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 12,
  },
  {
    title: "Spicy Chicken Noodle Soup",
    desc: "Infuses the soup with heat elements like chili peppers, cayenne, or hot sauce, ideal for those who enjoy a spicy kick.",
    price: "19.10",
    image:
      "https://i.pinimg.com/564x/3e/e5/d7/3ee5d788d60725650459d80e438e4707.jpg",
    discount: "0.65",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 12,
  },
  {
    title: "Italian Chicken Noodle Soup",
    desc: "Features Italian herbs like oregano and basil, and might include ingredients like tomatoes or Parmesan cheese, with a possibility of using pasta like fusilli or rotini instead of classic noodles.",
    price: "20.50",
    image:
      "https://i.pinimg.com/564x/af/66/56/af6656dfa03a65a6bf40045d312f26e4.jpg",
    discount: "0",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 12,
  },
  {
    title: "Classic Minestrone Soup",
    desc: "A traditional Italian soup made with a variety of vegetables like carrots, celery, and beans, pasta or rice, and often includes tomatoes and a vegetable or chicken broth.",
    price: "18.99",
    image:
      "https://i.pinimg.com/564x/ea/ed/a4/eaeda49e43ce20003354fcbfd6ba8377.jpg",
    discount: "0",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 13,
  },
  {
    title: "Winter Minestrone",
    desc: "Packed with seasonal winter vegetables like squash and kale, and might include potatoes for extra heartiness, perfect for colder weather.",
    price: "20.25",
    image:
      "https://i.pinimg.com/564x/3b/22/ef/3b22ef71178b104d8ccbf9f267e0359e.jpg",
    discount: "0",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 13,
  },
  {
    title: "Pesto Minestrone",
    desc: "Adds a swirl of basil pesto before serving, infusing the soup with a fresh and aromatic flavor.",
    price: "19.50",
    image:
      "https://i.pinimg.com/564x/f4/36/b4/f436b45baab1a8a56f5acb9aa9317bf7.jpg",
    discount: "0",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 13,
  },
  {
    title: "Spicy Minestrone",
    desc: "Incorporates spicy elements like red pepper flakes or a spicy sausage, adding a kick to the traditional vegetable mix.",
    price: "21.10",
    image:
      "https://i.pinimg.com/564x/5f/f8/c1/5ff8c1d473f5b4d9f12e9ad1a5ef905c.jpg",
    discount: "0",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 13,
  },
  {
    title: "Seafood Minestrone",
    desc: "A unique twist on the classic, this version includes seafood like shrimp or clams, offering a lighter but protein-rich soup.",
    price: "22.40",
    image:
      "https://i.pinimg.com/564x/2a/3b/e3/2a3be33c532b556acea8142556ef634b.jpg",
    discount: "0.90",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 13,
  },
  {
    title: "Classic Miso Soup",
    desc: "Typically made with a dashi broth, miso paste, tofu, and seaweed, offering a savory, umami-rich flavor.",
    price: "12.99",
    image:
      "https://i.pinimg.com/564x/08/c5/6f/08c56fba346da4ec114cd0a189b1310b.jpg",
    discount: "0.40",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 14,
  },
  {
    title: "Miso Soup with Vegetables",
    desc: "Enhanced with a variety of vegetables like carrots, mushrooms, and bok choy, adding nutritional value and texture.",
    price: "14.50",
    image:
      "https://i.pinimg.com/564x/6a/04/3a/6a043ae88384aa95a7b366b22c47ae2c.jpg",
    discount: "0",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 14,
  },
  {
    title: "Seafood Miso Soup",
    desc: "Includes seafood such as clams, shrimp, or pieces of fish, complementing the miso broth with oceanic flavors.",
    price: "15.75",
    image:
      "https://i.pinimg.com/564x/37/18/16/371816a6a61479403262ca8db39fb0af.jpg",
    discount: "0",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 14,
  },
  {
    title: "Spicy Miso Soup",
    desc: "Infuses the soup with a spicy element like chili oil or red pepper flakes, adding a warming kick to the traditional recipe.",
    price: "13.20",
    image:
      "https://i.pinimg.com/564x/8d/b0/4b/8db04be6dcc0a7a1b2ccc2f14afe8547.jpg",
    discount: "0",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 14,
  },
  {
    title: "Miso Soup with Chicken",
    desc: "A less traditional version that incorporates chicken pieces, providing a hearty and protein-rich twist to the classic soup.",
    price: "16.30",
    image:
      "https://i.pinimg.com/564x/18/94/fd/1894fd82f2265f9a2a6dd7b492eb8a42.jpg",
    discount: "0",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 14,
  },
  {
    title: "Classic French Onion Soup",
    desc: "Made with caramelized onions, beef broth, a splash of wine, and topped with a toasted baguette slice and melted Gruyère cheese.",
    price: "17.99",
    image:
      "https://i.pinimg.com/564x/90/0c/b8/900cb83abe043519db113acc21d40478.jpg",
    discount: "0",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 15,
  },
  {
    title: "Vegetarian French Onion Soup",
    desc: "Substitutes the beef broth with a rich vegetable broth, maintaining the classic flavors while making it suitable for vegetarians.",
    price: "16.50",
    image:
      "https://i.pinimg.com/564x/d9/2c/ba/d92cba02da35cf6e1209f51de9b1c9d1.jpg",
    discount: "0",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 15,
  },
  {
    title: "Beer-Infused French Onion Soup",
    desc: "Replaces the traditional wine with a dark beer, adding a unique depth of flavor to the caramelized onions and broth.",
    price: "18.75",
    image:
      "https://i.pinimg.com/564x/2e/e2/1a/2ee21a7e510c4a41c5269d19176ca185.jpg",
    discount: "0.65",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 15,
  },
  {
    title: "French Onion Soup with Garlic Croutons",
    desc: "Includes homemade garlic croutons on top for an extra layer of flavor and crunch, adding to the traditional cheese topping.",
    price: "19.20",
    image:
      "https://i.pinimg.com/564x/c5/ba/6e/c5ba6ef50480159c4139ce93a5593e6e.jpg",
    discount: "0",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 15,
  },
  {
    title: "Three-Cheese French Onion Soup",
    desc: "Enhances the soup with a mix of cheeses such as Gruyère, Parmesan, and mozzarella, creating a more complex and rich cheese topping.",
    price: "20.99",
    image:
      "https://i.pinimg.com/564x/33/81/97/338197cb9662a9492faca5c8b2f91c59.jpg",
    discount: "0",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 15,
  },
  {
    title: "Lemon Herb Grilled Salmon",
    desc: "Marinated or brushed with a mix of lemon juice and herbs like dill or parsley, offering a fresh, citrusy flavor.",
    price: "22.99",
    image:
      "https://i.pinimg.com/564x/52/e0/c9/52e0c9cccad77546913fcfe8aef5c257.jpg",
    discount: "0.50",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 16,
  },
  {
    title: "Teriyaki Grilled Salmon",
    desc: "Glazed with teriyaki sauce, providing a sweet and savory taste, often garnished with sesame seeds and green onions.",
    price: "24.50",
    image:
      "https://i.pinimg.com/564x/e7/d0/9d/e7d09dd8f9541d639d366d3ac4929a5d.jpg",
    discount: "0",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 16,
  },
  {
    title: "Spicy Grilled Salmon",
    desc: "Coated with a spicy rub or marinade, including ingredients like chili powder or cayenne pepper, for those who enjoy a bit of heat.",
    price: "23.75",
    image:
      "https://i.pinimg.com/564x/a9/67/58/a96758c7950ea66f31c3bc5d3d35f264.jpg",
    discount: "0.65",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 16,
  },
  {
    title: "Cedar Plank Grilled Salmon",
    desc: "Cooked on a cedar plank, which imparts a smoky, woodsy flavor to the fish, a popular method in North American cuisine.",
    price: "25.20",
    image:
      "https://i.pinimg.com/564x/9e/6e/72/9e6e72072695057d15315fc2454b0c35.jpg",
    discount: "0",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 16,
  },
  {
    title: "Maple Glazed Grilled Salmon",
    desc: "Brushed with a maple syrup glaze, often mixed with mustard or soy sauce, creating a sweet and slightly tangy flavor profile.",
    price: "26.99",
    image:
      "https://i.pinimg.com/564x/cd/15/d7/cd15d74e5944c0f2c6a90b32fb3868b9.jpg",
    discount: "0",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 16,
  },
  {
    title: "Classic Shrimp Scampi",
    desc: "Features shrimp sautéed in garlic butter, lemon juice, and white wine, often served over pasta or with crusty bread.",
    price: "21.99",
    image:
      "https://i.pinimg.com/564x/9b/76/67/9b7667c74bd06f7d6e5dcbcf19a8aa5a.jpg",
    discount: "0",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 17,
  },
  {
    title: "Spicy Shrimp Scampi",
    desc: "Adds a spicy kick with red pepper flakes or a dash of hot sauce, enhancing the garlicky butter sauce.",
    price: "23.50",
    image:
      "https://i.pinimg.com/564x/77/85/8d/77858df6b1ffa9ea2de87f4ac4790c7f.jpg",
    discount: "0",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 17,
  },
  {
    title: "Shrimp Scampi with Tomatoes and Spinach",
    desc: "Includes cherry tomatoes and fresh spinach, adding color and a nutritional boost to the classic dish.",
    price: "22.75",
    image:
      "https://i.pinimg.com/564x/78/20/f2/7820f2d26864975d2cf11086a6f3b5ea.jpg",
    discount: "0",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 17,
  },
  {
    title: "Creamy Shrimp Scampi",
    desc: "Introduces cream or cream cheese into the sauce, creating a richer and more indulgent version of the traditional scampi.",
    price: "24.20",
    image:
      "https://i.pinimg.com/564x/af/bf/93/afbf93543962e444cda0835fe31f09c1.jpg",
    discount: "0.70",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 17,
  },
  {
    title: "Shrimp Scampi with Zucchini Noodles",
    desc: "Swaps traditional pasta for zucchini noodles, offering a lighter, low-carb alternative while still maintaining the flavorful scampi sauce.",
    price: "25.99",
    image:
      "https://i.pinimg.com/564x/e6/10/81/e61081328228192c8163a4f58a3ebf47.jpg",
    discount: "0",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 17,
  },
  {
    title: "Classic Beer-Battered Fish and Chips",
    desc: "The traditional version featuring fish (often cod or haddock) coated in a crispy beer batter, served with thick-cut fries.",
    price: "19.99",
    image:
      "https://i.pinimg.com/564x/af/89/96/af8996122b29bb15b29f37c9bd200810.jpg",
    discount: "0",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 18,
  },
  {
    title: "Panko-Crusted Fish and Chips",
    desc: "Uses Panko breadcrumbs for the coating, resulting in an extra crunchy texture.",
    price: "21.50",
    image:
      "https://i.pinimg.com/564x/d8/d9/73/d8d9733818a33e835d0bbbb2db9da829.jpg",
    discount: "0.60",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 18,
  },
  {
    title: "Spicy Fish and Chips",
    desc: "Adds spices like cayenne pepper or paprika to the batter for a bit of heat, served with similarly seasoned chips.",
    price: "20.75",
    image:
      "https://i.pinimg.com/564x/ce/67/86/ce67865756c1224977aa8f1d6ac7c4f3.jpg",
    discount: "0",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 18,
  },
  {
    title: "Herb-Infused Fish and Chips",
    desc: "Incorporates herbs like dill or parsley into the batter for a subtle, aromatic flavor.",
    price: "22.20",
    image:
      "https://i.pinimg.com/564x/b9/e6/72/b9e67273279a1644142f340601adf423.jpg",
    discount: "0",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 18,
  },
  {
    title: "Baked Fish and Chips",
    desc: "Offers a healthier alternative, with the fish oven-baked instead of fried, and served with oven-baked chips.",
    price: "23.99",
    image:
      "https://i.pinimg.com/564x/2f/9a/bf/2f9abfc206ef26b8820692beeb6350f8.jpg",
    discount: "0.80",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 18,
  },
  {
    title: "Classic Lobster Thermidor",
    desc: "Made with lobster meat cooked in a creamy sauce with cognac or brandy, mustard, and cheese, then broiled in the lobster shell.",
    price: "32.99",
    image:
      "https://i.pinimg.com/564x/69/3c/cf/693ccf068316298501052c409defaa5a.jpg",
    discount: "1.50",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 19,
  },
  {
    title: "Sherry Lobster Thermidor",
    desc: "Uses sherry instead of cognac for a slightly sweeter and more nuanced flavor in the sauce.",
    price: "34.50",
    image:
      "https://i.pinimg.com/564x/fe/18/81/fe18817f215cdd0a5c9166484ce3af3a.jpg",
    discount: "0.60",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 19,
  },
  {
    title: "Mushroom Lobster Thermidor",
    desc: "Includes finely chopped mushrooms in the sauce, adding an earthy depth to the rich, creamy dish.",
    price: "33.75",
    image:
      "https://i.pinimg.com/564x/8f/be/b1/8fbeb14e53afdf109b1cd5087d08f29e.jpg",
    discount: "0.65",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 19,
  },
  {
    title: "Spicy Lobster Thermidor",
    desc: "Introduces a spicy element, such as cayenne pepper or hot mustard, to add a kick to the traditional recipe.",
    price: "35.20",
    image:
      "https://i.pinimg.com/564x/0b/af/c8/0bafc8e2ecd6b0991f04fb83736c59e8.jpg",
    discount: "0.70",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 19,
  },
  {
    title: "Herb Lobster Thermidor",
    desc: "Infused with fresh herbs like tarragon or chervil, lending a fragrant and fresh taste to the creamy lobster mixture.",
    price: "36.99",
    image:
      "https://i.pinimg.com/564x/94/70/0c/94700c7dc48d403b8880248dedd857da.jpg",
    discount: "0.80",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 19,
  },
  {
    title: "Nigiri Sushi",
    desc: "Slices of raw fish over pressed vinegared rice, often with a touch of wasabi between the fish and rice.",
    price: "18.99",
    image:
      "https://i.pinimg.com/564x/cc/44/7b/cc447b8e6f625c89f74cef8911c25ad5.jpg",
    discount: "0.50",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 20,
  },
  {
    title: "Maki Sushi (Rolled Sushi)",
    desc: "Rice and various fillings (like fish, vegetables, or avocado) wrapped in seaweed and cut into bite-sized pieces.",
    price: "16.50",
    image:
      "https://i.pinimg.com/564x/7d/36/fd/7d36fd4990619585c8d84d72deed22e0.jpg",
    discount: "0",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 20,
  },
  {
    title: "Sashimi",
    desc: "Thinly sliced raw fish or seafood, served without rice. It's a pure way to enjoy the flavor of the fish.",
    price: "20.75",
    image:
      "https://i.pinimg.com/564x/02/02/3b/02023bf04db6b393f228ed30e91f7b40.jpg",
    discount: "0",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 20,
  },
  {
    title: "Temaki Sushi (Hand Roll)",
    desc: "A cone-shaped piece of seaweed filled with rice, fish, and vegetables, meant to be eaten with hands.",
    price: "17.20",
    image:
      "https://i.pinimg.com/564x/fb/55/02/fb55021d01256cd73a7f2be16b237e7a.jpg",
    discount: "0",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 20,
  },
  {
    title: "Uramaki (Inside-Out Roll)",
    desc: "A roll where rice is on the outside and seaweed wraps around the filling. Often includes toppings or sauces.",
    price: "19.99",
    image:
      "https://i.pinimg.com/564x/fd/82/23/fd8223f98706939f1105c7388ddf7c17.jpg",
    discount: "0",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 20,
  },
  {
    title: "Classic Southern Fried Chicken",
    desc: "Coated in a seasoned flour mixture and deep-fried until golden and crispy, known for its juicy interior and flavorful crust.",
    price: "15.99",
    image:
      "https://i.pinimg.com/564x/8c/73/bf/8c73bf2da0a7aa081e353942f4b84782.jpg",
    discount: "0.50",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 21,
  },
  {
    title: "Korean Fried Chicken",
    desc: "Double-fried for extra crispiness and often glazed with a sweet and spicy sauce, sometimes garnished with sesame seeds and green onions.",
    price: "17.50",
    image:
      "https://i.pinimg.com/564x/c6/fe/08/c6fe081faa1dbfafd239f3d4812ead17.jpg",
    discount: "0",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 21,
  },
  {
    title: "Buttermilk Fried Chicken",
    desc: "Marinated in buttermilk before frying, which tenderizes the chicken and adds a tangy flavor to the coating.",
    price: "16.75",
    image:
      "https://i.pinimg.com/564x/a7/14/12/a71412ed8e15e6b17b9376a3777ae5bd.jpg",
    discount: "0",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 21,
  },
  {
    title: "Spicy Fried Chicken",
    desc: "Incorporates hot spices like cayenne pepper into the breading or is glazed with a spicy sauce, offering a fiery twist on the classic.",
    price: "18.20",
    image:
      "https://i.pinimg.com/564x/1e/dd/96/1edd96dd17cf5984b1e1d58103612c49.jpg",
    discount: "0.70",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 21,
  },
  {
    title: "Fried Chicken Tenders",
    desc: "Strips of chicken breast coated and fried, often served with a variety of dipping sauces, popular as a snack or lighter option.",
    price: "14.99",
    image:
      "https://i.pinimg.com/564x/53/31/30/533130bde3b88dbd5616962274d444bd.jpg",
    discount: "0",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 21,
  },
  {
    title: "Classic French Fries",
    desc: "Thinly cut potatoes deep-fried until crispy and golden, often salted and served with ketchup.",
    price: "7.99",
    image:
      "https://i.pinimg.com/564x/57/22/00/57220047fc59da5722f2daf2bf683b67.jpg",
    discount: "0",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 22,
  },
  {
    title: "Curly Fries",
    desc: "Potatoes cut in a spiral shape, seasoned with a spicy mix, and deep-fried for a fun and flavorful twist.",
    price: "8.50",
    image:
      "https://i.pinimg.com/564x/d0/70/1b/d0701b28d48d62cb84a924254489cb6a.jpg",
    discount: "0",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 22,
  },
  {
    title: "Garlic Parmesan Fries",
    desc: "Tossed with garlic and Parmesan cheese, often garnished with parsley, offering a savory, aromatic flavor.",
    price: "9.75",
    image:
      "https://i.pinimg.com/564x/8b/90/9e/8b909e80674cafc011a9dbcdb62a6245.jpg",
    discount: "0",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 22,
  },
  {
    title: "Sweet Potato Fries",
    desc: "Made from sweet potatoes, these fries offer a sweeter taste and are often served with dipping sauces like aioli or maple mustard.",
    price: "10.20",
    image:
      "https://i.pinimg.com/564x/9c/37/3e/9c373eccfd7eb1cfe697b3ea76072904.jpg",
    discount: "0",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 22,
  },
  {
    title: "Loaded Fries",
    desc: "Topped with various ingredients like melted cheese, bacon bits, sour cream, and green onions, turning the fries into a hearty dish.",
    price: "11.99",
    image:
      "https://i.pinimg.com/564x/36/39/99/363999ce3c066344943501b8d4fbdd60.jpg",
    discount: "0",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 22,
  },
  {
    title: "Classic Onion Rings",
    desc: "Thick slices of onion coated in a seasoned batter or breadcrumb mixture and deep-fried until golden and crispy.",
    price: "6.99",
    image:
      "https://i.pinimg.com/564x/42/3c/59/423c596cdbe2401bec9f628157c3a105.jpg",
    discount: "0",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 23,
  },
  {
    title: "Beer-Battered Onion Rings",
    desc: "Onion rings dipped in a batter made with beer, which adds a lightness and distinct flavor to the batter.",
    price: "7.50",
    image:
      "https://i.pinimg.com/564x/0f/21/8f/0f218f6b6e7cb58534a7434ecb21e7ac.jpg",
    discount: "0",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 23,
  },
  {
    title: "Panko Onion Rings",
    desc: "Uses Panko breadcrumbs for the coating, resulting in extra crunchy and light onion rings.",
    price: "8.75",
    image:
      "https://i.pinimg.com/564x/d9/96/ea/d996eaf7b86df729115016768995c29e.jpg",
    discount: "0",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 23,
  },
  {
    title: "Spicy Onion Rings",
    desc: "Infused with spices like cayenne pepper or chili powder in the batter or breading, adding a kick to the traditional onion ring.",
    price: "9.20",
    image:
      "https://i.pinimg.com/564x/12/7e/f1/127ef195a3c3f51f3838bb36bb2edb85.jpg",
    discount: "0.50",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 23,
  },
  {
    title: "Parmesan Onion Rings",
    desc: "Coated with a mix of breadcrumbs and grated Parmesan cheese, offering a cheesy and savory twist to the classic onion rings.",
    price: "10.99",
    image:
      "https://i.pinimg.com/564x/65/c7/b4/65c7b4b77c126547c94f30863ca74418.jpg",
    discount: "0.55",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 23,
  },
  {
    title: "Vegetable Tempura",
    desc: "A selection of vegetables like bell peppers, sweet potatoes, and broccoli, lightly coated in tempura batter and fried until crisp.",
    price: "12.99",
    image:
      "https://i.pinimg.com/564x/f4/72/d0/f472d0107a7958cf20d67b55579fa568.jpg",
    discount: "0.30",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 24,
  },
  {
    title: "Shrimp Tempura",
    desc: "Whole shrimp dipped in tempura batter, offering a light, crispy exterior with tender, juicy seafood inside.",
    price: "15.50",
    image:
      "https://i.pinimg.com/564x/39/76/75/397675e2d50c1f71d729c9e60091e34c.jpg",
    discount: "0",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 24,
  },
  {
    title: "Mixed Seafood Tempura",
    desc: "Includes various seafood such as fish, squid, and scallops along with shrimp, providing a variety of ocean flavors.",
    price: "17.75",
    image:
      "https://i.pinimg.com/564x/89/f4/0e/89f40ef68e3300c38bc8c85f0e1ef7d0.jpg",
    discount: "0",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 24,
  },
  {
    title: "Mushroom Tempura",
    desc: "Features different types of mushrooms like shiitake or oyster mushrooms, providing an earthy flavor and meaty texture.",
    price: "13.20",
    image:
      "https://i.pinimg.com/564x/68/98/60/6898602105960e9ee94625bf96ac19b0.jpg",
    discount: "0",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 24,
  },
  {
    title: "Tempura Udon",
    desc: "A combination dish where tempura, usually shrimp or vegetables, is served alongside udon noodles in a hot broth, offering a contrast of textures.",
    price: "18.99",
    image:
      "https://i.pinimg.com/564x/a3/e1/e6/a3e1e6f626f588ba7b1a0018fe0a2a3a.jpg",
    discount: "0",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 24,
  },
  {
    title: "Classic Churros",
    desc: "Traditional Spanish or Latin American pastry, deep-fried until golden and then rolled in sugar and cinnamon.",
    price: "5.99",
    image:
      "https://i.pinimg.com/564x/2c/42/c3/2c42c3a9726ece1de7134bf7dbc0d743.jpg",
    discount: "0",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 25,
  },
  {
    title: "Chocolate-Dipped Churros",
    desc: "Classic churros dipped in melted chocolate, either partially or fully, adding a sweet and rich flavor.",
    price: "6.50",
    image:
      "https://i.pinimg.com/564x/1d/31/77/1d3177a7bb5b01d138b219cf877b7f74.jpg",
    discount: "0",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 25,
  },
  {
    title: "Filled Churros",
    desc: "Injected with fillings like chocolate, dulce de leche, or cream, offering a gooey and decadent center.",
    price: "7.75",
    image:
      "https://i.pinimg.com/564x/38/f4/c1/38f4c1f52368f05e82cd0ca254958689.jpg",
    discount: "0",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 25,
  },
  {
    title: "Mini Churros",
    desc: "Smaller, bite-sized versions of the classic churro, perfect for snacking or as a dessert accompaniment.",
    price: "5.20",
    image:
      "https://i.pinimg.com/564x/19/22/20/19222084c5ae30afc7440289837e75c1.jpg",
    discount: "0.25",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 25,
  },
  {
    title: "Savory Churros",
    desc: "A less common variation, these might be seasoned with spices like paprika or cheese, omitting the traditional sugar coating for a savory twist.",
    price: "6.99",
    image:
      "https://i.pinimg.com/564x/02/b1/90/02b1904b17c13e75950ddf612333ef34.jpg",
    discount: "0.40",
    vendor_name: "RiccoFood",
    vendor_rating: 4.2,
    address: "some",
    subCatId: 25,
  },
];