import AddProduct from "../../components/shop/addNewProductPage";
export default function EditProductPage() {
  return <AddProduct />;
}

export const getServerSideProps = async () => {
  return { props: {} };
};
