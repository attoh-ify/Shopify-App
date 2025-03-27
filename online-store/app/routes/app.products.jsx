import { Page, Layout, Box, Card, Text, Button, ResourceList, ResourceItem, Thumbnail } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { useLoaderData } from "@remix-run/react";
import { ProductIcon } from "@shopify/polaris-icons";


export const loader = async ({ request }) => {
    const { admin } = await authenticate.admin(request);

    const response1 = admin.graphql(`
    #graphql
    query fetchShop {
        shop {
            id
            name
        }
    }`);

    const response2 = admin.graphql(`
    #graphql
    query fetchProducts {
        products(first: 10) {
            edges {
                node{
                    id
                    title
                    handle
                    featuredImage {
                        url
                        altText
                    }
                }
            }
        }
    }`);

    const shopData = (await (await response1).json()).data;
    const productsData = (await (await response2).json()).data;
    console.log(shopData);
    console.log(productsData);
    return new Response(JSON.stringify({ shop: shopData.shop, products: productsData.products.edges }), {
        headers: { 'Content-Type': 'application/json' }
    });
};


export default function Products() {
    const { shop, products } = useLoaderData();

    const renderMedia = (image) => {
        return image ? <Thumbnail source={image.url} alt={image.altText} />
            : <Thumbnail source={ProductIcon} alt="Product" />
    };

    const renderItem = (item) => {
        const { id, url, title, handle, featureImage } = item.node;
        
        return (
            <ResourceItem
                id={id}
                url={url}
                media={renderMedia(featureImage)}
                onClick={() => {shopify.toast.show(`This item is called ${title}`)}}
                >
                <Text as="h5" variant="bodyMd">
                    {title}
                </Text>
                <div>{handle}</div>
            </ResourceItem>
        )
    };

    return (
        <Page>
            <ui-title-bar title="Products">
                <button variant="primary" onClick={() => {
                    shopify.modal.show("create-product-model")
                }}>Create a new Product</button>
            </ui-title-bar>

            <ui-modal id="create-product-model">
                <ui-title-bar title="Create a new Product">
                </ui-title-bar>
                <Box padding="500">
                    This is where you will create the form to create a new product.
                </Box>
            </ui-modal>
            <Layout>
                <Layout.Section>
                    <Card>
                        <Text as="span" variant="bodyLg">{shop.name}</Text>
                        <ResourceList
                            resourceName={{
                                singular: "Product",
                                plural: "Products"
                            }}
                            items={products || []}
                            renderItem={renderItem}
                        />
                        <Button variant="primary" onClick={() => shopify.toast.show("Hello World!")}>Button</Button>
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    )
}
