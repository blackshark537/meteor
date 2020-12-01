export interface GlobalResponseInterface{
    msg: string;
    docs?: any[];
    doc?: any;
    totalDocs: number;
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

 interface TrackList{
     Name: string;
     TrackUrl: string
 }

export interface ALbumInterface{
    _id?: string;
    Name: string;
    ImageUrl: string;
    releaseDate: string;
    Gener?: string;
    Artist: any;
    Created?: string;
    TrackList:TrackList[];
}

export interface AlbumDto{
    Name: string;
    ImageUrl: string;
    releaseDate: string;
    Gener: string;
    Artist: string;
}

/* 
 *  Artist Interfaces 
 */
export interface ArtistDto{
    Name: string;
    ImageUrl: string;
}

export interface ArtistInterface{
    _id: string;
    Name: string;
    ImageUrl?: string;
    Created: string;
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
    _id?: string;
    Name?: string;
    TrackNumber?: number,
    TrackUrl?: string;
    Market?: string;
    Duration?: number;
    CopyRight?: boolean;
    Artist?: string;
    Album?: string;
    ImageUrl?: string;
    Created?: string;
    AlbumName?: string;
    ArtistName?: string;
};