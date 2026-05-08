import AddProduct from "../components/shop/addNewProductPage";
export default function CreateProductPage() {
  return <AddProduct />;
}

export const getServerSideProps = async () => {
  return { props: {} };
};
