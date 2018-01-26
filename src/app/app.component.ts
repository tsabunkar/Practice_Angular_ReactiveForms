import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, FormBuilder, Validators, AbstractControl, FormArray} from "@angular/forms";

function customRatingRange(absConObj : AbstractControl): {[key : string] : boolean} | null {

  if((isNaN(absConObj.value) || absConObj.value<1 || absConObj.value > 5)) {
    return {'myrange': true}; // key is the name of the validation rule and value is true which mean validation rule was broken
  }
  else // else part is executed if validation rule is correct or satisfied.
  {
    return null;
  }
}


function customEmailMatcher(absConObj : AbstractControl) : {[key : string] : boolean} | null {
  let emailFormControl = absConObj.get('myEmail');
  let confirmEmailFormControl = absConObj.get('myConfirmEmail');

  if(emailFormControl.pristine || confirmEmailFormControl.pristine){
    return null;
  }
  if(emailFormControl.value === confirmEmailFormControl.value){
    return null;
  }
  else{ //block is executed if email and confirmemail mismatch
    return {'mymatch' : true};
  }
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  constructor(private formBuilderObj : FormBuilder){}

  formGroupObj : FormGroup;



  ngOnInit() : void {
    this.formGroupObj = this.formBuilderObj.group({

      myFirstName  : ['', [Validators.required, Validators.minLength(3)]],
      mylastName : ['sa',Validators.required],
      myPhone : '',
      myNotifiy : 'emailSelec',
      myRating : ['', customRatingRange],

      emailGroup: this.formBuilderObj.group(
        {
          myEmail : ['', [Validators.required , Validators.pattern('[a-z0-9._]+@[a-z]+')]],
          myConfirmEmail: ['', Validators.required]
        },
        {validator : customEmailMatcher} ),

      mySendCatalog : true,
      arrayOfAddrs_FormArray : this.formBuilderObj.array( [ this.buildAddress()] ) //Use of FormArray
                                                                                // to add HTML Elem dynamically

    });


    //this below line of code we are watching for the changes in between the radio btn if notification.
    this.formGroupObj.get('myNotifiy').valueChanges
      .subscribe(args => {
        console.log("Radio btn selected is : "+args)
        this.sendNotificationVia(args)
      })

  } //end of ngOnInit()



  get arrayOfAddrs_FormArray(): FormArray{
    return <FormArray>this.formGroupObj.get('arrayOfAddrs_FormArray');
  }

  buildAddress() : FormGroup {
    return  this.formBuilderObj.group({
      myAddressType : 'home',
      myStreet : '',
      myCity : '',
      myState : '',
      myZip : ''
    });
  }


  addAddress() : void {
    this.arrayOfAddrs_FormArray.push(this.buildAddress());
  }



  sendNotificationVia(radioBtnSelec: string) : void {
    const phoneFormControl = this.formGroupObj.get("myPhone")
    if(radioBtnSelec === 'phoneSelec') {
      phoneFormControl.setValidators(Validators.required); //on fly ur setting the validation rule
    }
    else{
      // emailFormControl.setValidators([Validators.required, Validators.pattern('[a-z0-9._]+@[a-z0-9.-]+')])
      phoneFormControl.clearValidators();

    }
    phoneFormControl.updateValueAndValidity();
  }


  mySaveForm(): void{
    console.log("form Model is : ");
    console.log(this.formGroupObj);
    console.log("value is : " + JSON.stringify(this.formGroupObj.value))
  }

  testData() : void{
    this.formGroupObj.patchValue({
      myFirstName : 'Tejas',
      mylastName : "Sabunkar"
    })
  }


}
