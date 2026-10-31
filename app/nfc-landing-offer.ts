import type {SiteProduct,SiteSettings} from './site-data';
// Previous prices supplied by the owner on 31 October 2026; current prices stay in products.
export const approvedLandingReferences:Record<string,number>={'carte-visite-personnalisee':329,'carte-visite':229};
export function landingProduct(product:SiteProduct,settings:Pick<SiteSettings,'nfcLandingReferencePrices'>):SiteProduct{
 const configured=settings.nfcLandingReferencePrices;
 const explicit=configured&&Object.prototype.hasOwnProperty.call(configured,product.id);
 const value=Number(explicit?configured[product.id]:product.compareAtPrice??product.metadata?.compareAtPrice??approvedLandingReferences[product.id]);
 return {...product,compareAtPrice:Number.isFinite(value)&&value>product.price?value:undefined,metadata:{...product.metadata,compareAtPrice:undefined}};
}
