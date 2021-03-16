import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../../core/models/user';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    options: FormGroup;
    ngOnInit(): void {

        
    }

    constructor(fb: FormBuilder, private router: Router,
        private readonly activatedRouter: ActivatedRoute) {
        this.options = fb.group({
            color: 'primary',
            fontSize: [16, Validators.min(10)]
        });
        this.activatedRouter.paramMap.subscribe(params => {
        
            if (params.has('token')) {
                let user = new User();
                user.token = ''+params.get('token');
                if(params.get('user')){
                    user.member = ''+ params.get('user'); 
                }else{
                    user.member = ''; 
                }
                sessionStorage.setItem('member',user.member);
                sessionStorage.setItem('language',params.get('language'));
                sessionStorage.setItem('currentUser', JSON.stringify(user));
                sessionStorage.setItem('hours', '24');

    
                this.router.navigate(['/dashboard']);
            }});
            this.router.navigate(['/login']);

    }

    getFontSize() {
        return Math.max(10, this.options.value.fontSize);
    }

    login() {
      
    }
}
