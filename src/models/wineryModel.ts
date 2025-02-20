interface Winery {
    id?: string;
    name: string;
    city: string;
    country: string;
    denomination: string;
    district: string;
    region: string;
    village: string;
    wines?: Wine[];
    link?: string;
}