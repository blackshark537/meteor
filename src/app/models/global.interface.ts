/* 
* User Interfaces
*/
export interface RegisterUser{
    username: string;
    email: string;
    password: string;
}
  
export interface LoginUser{
    identifier: string;
    password: string;
}
  
export interface LoginResp{
    jwt: string;
    user: UserInterface
}

export interface UserInterface{
    playlists: userPlaylist[];
    likes?: Track[];
    blocked: boolean;
    confirmed: boolean;
    created_at: string;
    email: string;
    id: number;
    provider: string;
    role: Role;
    updated_at: string;
    username: string;
}

export interface userPlaylist{
    id: number;
    canciones: Track[];
    created_at: Date;
    nombre: string;
    published_at: Date;
    users_permissions_user: UserInterface
}

interface Role{
    id: number;
    name: string;
    description: string;
    type: string;
}

/* 
 * ALBUM INTERFACES 
 */

 export interface Album{
    "id": 2,
    "nombre": string;
    "publicado"?: string;
    "published_at"?: string;
    "created_at"?: string;
    "updated_at"?: string;
    "canciones"?: Canciones;
    "portada"?: Imagen[];
    "genero"?: Categories[];
    "artistas"?: Artist[];
 }

 export interface Artist{
    "id": number;
    "nombre": string;
    "published_at": string;
    "created_at": string;
    "updated_at": string;
    "imagen": Imagen;
 }

 interface Imagen{
    "id": number;
    "name": string;
    "alternativeText": string;
    "caption": string;
    "width": number;
    "height": number;
    "formats": {
        "thumbnail": Formats;
        "large": Formats;
        "medium": Formats;
        "small": Formats;
    };
    "hash": string;
    "ext": string;
    "mime": string;
    "size": 212.72,
    "url": string;
    "previewUrl": string;
    "provider": string;
    "provider_metadata": string;
    "created_at": string;
    "updated_at": string;
}

interface Formats{
    "name": string;
    "hash": string;
    "ext": string;
    "mime": string;
    "width": string;
    "height": string;
    "size": number;
    "path": string;
    "url": string;
}

interface Canciones{
        "id": number,
        "name": string;
        "url": string;
        "nombre": string;
        "file": FileInterface[];
        "tracks"?: Track[];
}

export interface Track{
  "id": number;
  "nombre": string;
  "publicado": any;
  "reproducido": string;
  "etiquetas": any;
  "published_at": Date;
  "created_at": Date;
  "updated_at": Date;
  "album": Album;
  "artist": Artist;
  "desc": string;
  "Genero": Categories;
  "user": UserInterface;
  "likes": string;
  "file": FileInterface;
  "image": Imagen;
}

export interface FileInterface{
    "id": number;
    "name": string;
    "alternativeText": string;
    "caption": string;
    "width": number;
    "height": number;
    "formats": number;
    "hash": string;
    "ext": string;
    "mime": string;
    "size": number;
    "url": string;
    "previewUrl": string;
    "provider": string;
    "provider_metadata": string;
    "created_at": string;
    "updated_at": string;
}

 export interface Categories{
    "id": number;
    "nombre": string;
    "published_at": string;
    "created_at": string;
    "updated_at": string;
    "albums": Album[];
 }


/* 
 * TracksInterfaces
 */

export interface TrackDto{
    Name: string;
    TrackNumber: number;
    TrackUrl: string;
    Market: string;
    Duration: number;
    Album: string;
    Artist: string;
    CopyRight?: boolean;
};

export interface TrackInterface{
    _id?: any;
    Name?: string;
    TrackNumber?: number,
    TrackUrl?: string;
    Market?: string;
    Duration?: number;
    CopyRight?: boolean;
    Artist?: string;
    Plays?: string;
    Album?: string;
    ImageUrl?: string;
    Created?: string;
    AlbumName?: string;
    ArtistName?: string;
};