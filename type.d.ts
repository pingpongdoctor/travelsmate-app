type Categories = 'comestic' | 'book' | 'supplement' | 'jewelry';

type EmailTemplates = 'welcome' | 'reset-password' | 'password-change';

type TemplateEnvs = Record<EmailTemplates, string>;

interface HomePageData {
  herotext: string;
  introheading: string;
  introcontent: any;
}

interface SanityProduct {
  slug: { _type: string; current: string };
  title: 'string';
  images: any;
  detail: any;
  featured: boolean;
  price: string;
  category: Categories;
  instock: number;
}

interface ProductInShoppingCart {
  productSlug: string;
  productQuantity: number;
  productCategory: Categories;
  productId: number;
}

type ProductWithImgUrl = SanityProduct & {
  imgUrl: string;
};

interface FormInfor {
  [index: Field]: { value: string; isError: boolean };
  username: { value: string; isError: boolean };
  message: { value: string; isError: boolean };
  email: { value: string; isError: boolean };
}

interface InputBoxInfor {
  id: string;
  name: Field;
}

interface ColunmInfor {
  id: string;
  colunm: Field;
}

interface User {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

interface ImageInfor {
  _type: string;
  alt: string;
  _key: string;
  asset: [Object];
}

interface DropdownItemInfor {
  path: string;
  name: string;
  description: string;
  icon: React.FC<any>;
}
