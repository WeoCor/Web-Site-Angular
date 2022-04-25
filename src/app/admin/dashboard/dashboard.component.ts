
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Offer } from 'src/app/interfaces/offer';
import { OffersService } from 'src/app/services/offers.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  currentofferphotofile!: any;

offerFrom!: FormGroup;

offers: Offer[] = [];

subscription!: Subscription;

currentofferphotourl!: string;



  constructor(
    private formbuilder:FormBuilder,
    private offerServices: OffersService
  ) {

  }

  ngOnInit(): void {
    this.initofferfrom();
    this.subscription = this.offerServices.offersSuject.subscribe({
      next: (offers: Offer[]) => {
        console.log('NEXT')
        this.offers = offers
      },
      complete: () => {
        console.log('Observable complete')
      },
      error: (error) =>{
        console.error(error);
      }
  });
  this.offerServices.getOffers();
  }

  onchangephoto($event: any):void{
    this.currentofferphotofile = $event.target.files[0];
    const filereader = new FileReader();
    filereader.readAsDataURL(this.currentofferphotofile);
    filereader.onloadend = (e) => {
      this.currentofferphotourl = <string>e.target?.result;
    }
  }


initofferfrom():void{
  this.offerFrom = this.formbuilder.group({
    id: [null],
    title: ['',Validators.required],
    photo: [],
    brand: '',
    model:'',
    description:'',
    price:0
  })
}


onsubmitofferform():void{
  const offerid = this.offerFrom.value.id;
  let offer = this.offerFrom.value;
  const offerphotourl = this.offers.find(el => el.id === offerid)?.photo;
  offer = {...offer, photo: offerphotourl};
  if(!offerid || offerid && offerid === ''){ //creation
    delete offer.id;
    this.offerServices.createOffers(offer, this.currentofferphotofile).catch(console.error);
  }else{ // modification
    delete offer.id;
   this.offerServices.editOffer(offer,offerid, this.currentofferphotofile).catch(console.error);
  }
this.offerFrom.reset();
this.currentofferphotofile = null;
this.currentofferphotourl = '';
console.log(this.offers);
}

oneditoffer(offer:any):void{
  this.currentofferphotourl = offer.photo ? <string>offer.photo: '';
  this.offerFrom.setValue({
    id: offer.id ? offer.id : '',
    title: offer.title ? offer.title : '',
    photo: '',
    brand: offer.brand ? offer.brand : '',
    model: offer.model ? offer.model : '',
    price: offer.price ? offer.price : 0,
    description: offer.description ? offer.description : '',
  })
}

ondelete(id?: string):void{
  if(id){
    this.offerServices.deleteOffer(id).catch(console.error) ;
  } else {
    console.error('problem id');
  }
}

ngOnDestroy(): void {
  this.subscription.unsubscribe();
}

}
