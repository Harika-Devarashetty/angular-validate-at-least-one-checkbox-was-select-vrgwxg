import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  ValidatorFn,
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { atLeastOneCheckboxCheckedValidator } from './atLeastOneCheckboxCheckedValidator';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  isLoadingCategory: boolean;
  categories: ProductCategory[];
  form: FormGroup;
  currentIndex: any;

  constructor(private formBuilder: FormBuilder) {}
  expand(index) {
    if (this.currentIndex === index) {
      this.currentIndex = null;
      return;
    }
    this.currentIndex = index;
  }

  get f() {
    return this.form && this.form.controls;
  }

  get categoriesFormArr(): FormArray {
    return this.f && <FormArray>this.f.categoriesFormArr;
  }

  get categoriesFormGroup(): FormGroup {
    return this.f && <FormGroup>this.f.categoriesFormGroup;
  }

  get categoriesFormGroupSelectedIds(): string[] {
    let ids: string[] = [];
    for (var key in this.categoriesFormGroup.controls) {
      if (this.categoriesFormGroup.controls[key].value) {
        ids.push(key);
      }
    }
    return ids;
  }

  get categoriesFormArraySelectedIds(): string[] {
    return this.categories
      .filter((cat, catIdx) =>
        this.categoriesFormArr.controls.some(
          (control, controlIdx) => catIdx === controlIdx && control.value
        )
      )
      .map((cat) => cat.id);
  }

  ngOnInit(): void {
    this.isLoadingCategory = true;
    this.form = this.formBuilder.group({
      // name: ["", Validators.required]
    });
    this.getCategories().subscribe((categories) => {
      this.isLoadingCategory = false;
      this.categories = categories;
      this.form.addControl(
        'categoriesFormArr',
        this.buildCategoryFormArr(categories)
      );
      this.form.addControl(
        'categoriesFormGroup',
        this.buildCategoryFormGroup(categories)
      );
    });
  }

  buildCategoryFormArr(
    categories: ProductCategory[],
    selectedCategoryIds: string[] = []
  ): FormArray {
    const controlArr = categories.map((category) => {
      let isSelected = selectedCategoryIds.some((id) => id === category.id);
      return this.formBuilder.control(isSelected);
    });
    return this.formBuilder.array(
      controlArr,
      atLeastOneCheckboxCheckedValidator()
    );
  }

  buildCategoryFormGroup(
    categories: ProductCategory[],
    selectedCategoryIds: string[] = []
  ): FormGroup {
    let group = this.formBuilder.group(
      {},
      {
        validators: atLeastOneCheckboxCheckedValidator(),
      }
    );
    categories.forEach((category) => {
      let isSelected = selectedCategoryIds.some((id) => id === category.id);
      group.addControl(category.id, this.formBuilder.control(isSelected));
    });
    return group;
  }

  onSubmit() {
    console.log(
      {
        groupVal: this.categoriesFormGroupSelectedIds,
        arrVal: this.categoriesFormArraySelectedIds,
      },
      null,
      2
    );
    alert(`formArr selected ids ${this.categoriesFormArraySelectedIds} 
    formgroup selected ids ${this.categoriesFormGroupSelectedIds}`);
  }

  getCategories(): Observable<ProductCategory[]> {
    let categories: ProductCategory[] = [
      {
        id: 'educationCatId',
        title: 'Education & Reference',
      },
      {
        id: 'lifestyleCatId',
        title: 'Lifestyle & Hobbies',
      },
      {
        id: 'businessCatId',
        title: 'Business & Office',
      },
    ];
    return of(categories).pipe(delay(1000));
  }
}

interface ProductCategory {
  id: string;
  title: string;
}
