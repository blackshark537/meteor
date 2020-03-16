export interface GlobalResponseInterface{
    msg: string;
    docs?: any[];
    doc?: any;
    totalDocs: number;
}

/* 
 * ALBUM INTERFACES 
 */

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
}

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
}

/* 
 * Categories Interface 
 */
export interface CategoryInteface{
    _id?: string;
    Name: string,
    Albums: ALbumInterface[]
    Created?: string;
}

export interface CategoryDto{
    _id?: string;
    Name: string,
    Albums: string[];
    Created?: string;
}