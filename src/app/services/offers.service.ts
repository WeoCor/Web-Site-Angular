import { PathLocationStrategy } from '@angular/common';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { promises } from 'dns';
import { BehaviorSubject, observable, Observable, Subject } from 'rxjs';
import { runInThisContext } from 'vm';
import { Offer } from '../interfaces/offer';

@Injectable({
  providedIn: 'root'
})
export class OffersService {

private offers: Offer[]= [];

  offersSuject: BehaviorSubject<Offer[]> = new BehaviorSubject(<Offer[]>[]);

  constructor(
    private db: AngularFireDatabase,
    private storage: AngularFireStorage
  ) {
    this.getOffersOn();
   }

  getOffers() {
    this.db.list('offer').query.limitToLast(10).once('value', snapshot => {

      const offerSnapshotValue = snapshot.val()
      if (offerSnapshotValue){
        const offer = Object.keys(offerSnapshotValue).map(id =>({id, ...offerSnapshotValue[id]}));
      this.offers = offer ;
      }


      this.dispatchoffer();
    });
  }

  getOffersOn(): void {
    this.db.list('offers').query.limitToLast(10).on('value', snapshot => {
      const offersSnapshotValue = snapshot.val();
      if(offersSnapshotValue){
      const offers = Object.keys(offersSnapshotValue).map(id => ({id, ...offersSnapshotValue[id]}));
      console.log(offers);
      }
    });
  }

  dispatchoffer() {
    this.offersSuject.next(this.offers);
  }

async  createOffers(offer:Offer, offerphoto:any): Promise<Offer>{

  try {

   const photourl = offerphoto ? await this.uploadphoto(offerphoto):  '';
    const reponse = this.db.list('offer').push({...offer, photo: photourl});
    const createdoffer = {...offer,photo: photourl, id:<string>reponse.key};
    this.offers.push(createdoffer);
   this.dispatchoffer();
    return createdoffer;

  } catch(error){
    throw error;
  }

  }


  async editOffer(offer: Offer, offerId: string, newOfferPhoto?: any): Promise<Offer> {
    try {
      if (newOfferPhoto && offer.photo && offer.photo !== '') {
        await this.removephoto(offer.photo);
      }
      if (newOfferPhoto) {
        const newPhotoUrl = await this.uploadphoto(newOfferPhoto);
        offer.photo = newPhotoUrl;
      }
      await this.db.list('offers').update(offerId, offer);
      const offerIndexToUpdate = this.offers.findIndex(el => el.id === offerId);
      this.offers[offerIndexToUpdate] = {...offer, id: offerId};
      this.dispatchoffer();
      return {...offer, id: offerId};
    } catch (error) {
      throw error;
    }
  }

  async deleteOffer(offerId: string): Promise<Offer> {
    try {
      const offerToDeleteIndex = this.offers.findIndex(el => el.id === offerId);
      const offerToDelete = this.offers[offerToDeleteIndex];
      if (offerToDelete.photo && offerToDelete.photo !== '') {
        await this.removephoto(offerToDelete.photo);
      }
      await this.db.list('offer').remove(offerId);
      this.offers.splice(offerToDeleteIndex, 1);
      this.dispatchoffer();
      return offerToDelete;
    } catch (error) {
      throw error;
    }
  }
private uploadphoto(photo: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const upload = this.storage.upload('offer/' +Date.now().toString() + '-' + photo.name, photo);
    upload.then((res) => {
      resolve(res.ref.getDownloadURL());
    }).catch(reject)
  })

}

private removephoto(photourl: string): Promise<any>{
  return new Promise((resolve, reject) => {
    this.storage.refFromURL(photourl).delete().subscribe({
      complete: () => resolve({}),
      error: reject
    })
})

}
}
