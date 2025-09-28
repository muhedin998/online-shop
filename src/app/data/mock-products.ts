import { Product } from '../models/product';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Premium ulje za bradu – Citrus Burst',
    description: 'Lako upijajuće, hranljivo ulje sa svežim citrusnim notama. Omekšava i umiruje dlaku brade.',
    price: 18.99,
    rating: 4.7,
    volume: '30ml',
    tags: ['citrus', 'lagano'],
    imageUrl:
      'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1200&auto=format&fit=crop',
    longDescription:
      'Naše brzo upijajuće ulje za bradu kombinuje lagana ulja nosače sa osvežavajućim citrusnim eteričnim uljima kako bi omekšalo dlaku, smirilo neposlušne vlasi i ostavilo čist, svež finiš. Idealno za svakodnevnu upotrebu bez masnog osećaja.',
    images: [
      'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1611930022073-b7a4ba5b3b49?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    id: 2,
    name: 'Klasični balzam – Sandalovina',
    description: 'Bogati balzam za negu i blago učvršćivanje sa toplim mirisom sandalovine.',
    price: 16.5,
    rating: 4.5,
    volume: '50ml',
    tags: ['balzam', 'sandalovina'],
    imageUrl:
      'https://images.unsplash.com/photo-1603190287605-e7c1f5600a3b?q=80&w=1200&auto=format&fit=crop',
    longDescription:
      'Negujte, oblikujte i zaštitite bradu tradicionalnim balzamom od sandalovine koji pruža blag stepen učvršćivanja i dugotrajnu hidrataciju. Pčelinji vosak i biljni ekstrakti zadržavaju vlagu bez ukočenosti.',
    images: [
      'https://images.unsplash.com/photo-1603190287605-e7c1f5600a3b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505575972945-28021aa00dd8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560743641-3914f2c45636?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    id: 3,
    name: 'Aftershave losion – Arktična nana',
    description: 'Osvežavajući losion posle brijanja koji umiruje kožu i smanjuje iritacije.',
    price: 14.0,
    rating: 4.4,
    volume: '100ml',
    tags: ['posle brijanja', 'nana'],
    imageUrl:
      'https://images.unsplash.com/photo-1543362906-acfc16c67564?q=80&w=1200&auto=format&fit=crop',
    longDescription:
      'Osvježavajući losion sa dominantnom notom nane koji tonira i osvežava nakon brijanja. Hamamelis i aloja uravnotežuju kožu, dok mentol pruža prijatan, rashlađujući osećaj.',
    images: [
      'https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    id: 4,
    name: 'Ulje pre brijanja – Biljna smirenost',
    description: 'Biljna mešavina koja pruža zaštitni film za žilet i štiti osetljivu kožu.',
    price: 12.75,
    rating: 4.2,
    volume: '30ml',
    tags: ['pre-brijanje', 'biljno'],
    imageUrl:
      'https://images.unsplash.com/photo-1585386959984-a4155223168f?q=80&w=1200&auto=format&fit=crop',
    longDescription:
      'Svilenkasto ulje pre brijanja bogato umirujućim biljkama štiti od posekotina i zatezanja. Omogućava lakše klizanje brijača za udobnije brijanje.',
    images: [
      'https://images.unsplash.com/photo-1585386959984-a4155223168f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1611930021781-0b9f1a5f44bc?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    id: 5,
    name: 'Šampon za bradu – Ugalj Clean',
    description: 'Detoksikacioni šampon sa aktivnim ugljem koji čini bradu svežom i čistom.',
    price: 13.2,
    rating: 4.3,
    volume: '200ml',
    tags: ['šampon', 'ugalj'],
    imageUrl:
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop',
    longDescription:
      'Temeljno čisti, a nežan prema koži. Formulisan sa aktivnim ugljem koji izvlači nečistoće, a čuva prirodna ulja. Ostavlja bradu i kožu uravnoteženom i osveženom.',
    images: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542884841-9f546e727b46?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1571782742271-4b4b90d98f5d?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    id: 6,
    name: 'Pasta za kosu – Jako učvršćivanje',
    description: 'Klasična pasta sa jakim učvršćivanjem i prirodnim finišem za oštre stilove.',
    price: 15.5,
    rating: 4.6,
    volume: '100g',
    tags: ['pasta', 'jako-učvršćivanje'],
    imageUrl:
      'https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?q=80&w=1200&auto=format&fit=crop',
    longDescription:
      'Omiljen u berbernicama – obezbeđuje strukturu tokom celog dana uz satenski, dodirljiv finiš. Lako se ispira bez ostataka.',
    images: [
      'https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600958877411-6a9ff8b37f53?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1581349437898-cbb067a4d9a3?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    id: 7,
    name: 'Brijač – Klasični sigurni',
    description: 'Bezvremenski brijač od nerđajućeg čelika za glatko i temeljno brijanje.',
    price: 29.99,
    rating: 4.8,
    tags: ['brijač', 'nerđajući-čelik'],
    imageUrl:
      'https://www.barbers.rs/wp-content/uploads/2023/01/RACA1904-3.jpg',
    longDescription:
      'Težinski ujednačen i izdržljiv. Ovaj sigurni brijač od nerđajućeg čelika nudi klasično dvostruko sečenje sa odličnom kontrolom i minimalnom iritacijom.',
    images: [
      'https://www.barbers.rs/wp-content/uploads/2023/01/RACA1904-3.jpg',
      'https://www.barbers.rs/wp-content/uploads/2023/01/RACA1904-3.jpg',
        'https://www.barbers.rs/wp-content/uploads/2023/01/RACA1904-3.jpg'
    ]
  },
  {
    id: 8,
    name: 'Četka za bradu – Svinjska dlaka',
    description: 'Ergonomska drvena četka sa prirodnim vlaknima za svakodnevnu negu.',
    price: 11.99,
    rating: 4.1,
    tags: ['četka', 'svinjska-dlaka'],
    imageUrl:
      'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1200&auto=format&fit=crop',
    longDescription:
      'Oblikovana za udobnost i kontrolu, naša četka od svinjske dlake ravnomerno raspoređuje ulja i pomaže u oblikovanju za uredniji i puniji izgled.',
    images: [
      'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1511406361295-0a1ff814c0ce?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1556228453-efd1eb991f48?auto=format&fit=crop&w=1200&q=80'
    ]
  }
];
