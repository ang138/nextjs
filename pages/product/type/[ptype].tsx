// pages/product/[ptype].tsx
import { NextPage, GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import Dropdown from '../dropdown'; // Import Dropdown component
import Image from "next/image";



export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const { params } = context;
  const productType = params?.ptype;

  try {
    const response = await fetch(`http://localhost:8000/product/producttype/${productType}`);

    if (response.ok) {
      const productByType = await response.json();

      console.log('Data fetched:', productByType);

      return {
        props: {
          productByType,
        },
      };
    } else {
      console.error('Error fetching data from API');
      return {
        notFound: true,
      };
    }
  } catch (error) {
    console.error('Error fetching data from API', error);

    return {
      notFound: true,
    };
  }
};

const ProductDetailPage: NextPage<{ productByType: any }> = ({ productByType }) => {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  if (!productByType || !productByType.length) {
    return <div>Data not found</div>;
  }

  const productType = productByType[0];
  const products = productType.products;

  return (
    <div>
      <h1>{productType.name}</h1>

      {/* เพิ่ม Dropdown component เพื่อให้ผู้ใช้เลือกประเภทสินค้า */}
      {/* <Dropdown /> */}

      {products.map((product: any) => (
        <div key={product.id} className="card">
          <h3>{product.name}</h3>
          <p>Description: {product.detail}</p>
          <p>Price: {product.price}</p>
          {/* <p>Image: {product.image}</p> */}
          {product.product_images && product.product_images.length > 0 && (
            <div>
              <h3>Images:</h3>
              {product.product_images.map((images: any) => (
                <div key={images.id}>
                  {/* <p>Original Name: {image.filename}</p>
                  <p>Path: {image.filename}</p> */}
                  <Image src={`/assets/images/${images.filename}`} alt="krapao" width={200} height={200} />
                  {/* <Image src={image.path} alt="krapao" width={200} height={200} /> */}
                </div>
              ))}
            </div>
          )}
          <hr />
        </div>
      ))}
    </div>
  );
};

export default ProductDetailPage;
