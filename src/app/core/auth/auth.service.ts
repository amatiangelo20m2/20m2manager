import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import {catchError, Observable, of, pipe, switchMap, throwError} from 'rxjs';
import {environment} from "../../../environments/environment";
import {BranchControllerService} from "../business/branch/branchController.service";
import {BASE_PATH} from "../common/variables";
import {DataproviderService} from "../../modules/admin/dashboard/dataprovider.service";


@Injectable({providedIn: 'root'})
export class AuthService {

    private _authenticated: boolean = false;

    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService) {
    }

    set accessToken(token: string) {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    forgotPassword(email: string): Observable<any> {
        return this._httpClient.post('api/auth/forgot-password', email);
    }

    resetPassword(password: string): Observable<any> {
        return this._httpClient.post('api/auth/reset-password', password);
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { email: string; password: string }): Observable<any> {

        if ( this._authenticated ) {
            return throwError('User is already logged in.');
        }

        return this._httpClient.post(BASE_PATH + '/ventimetriauth/api/auth/sign-in', credentials).pipe(
            switchMap((response: any) => {

                this.accessToken = response.accessToken;
                // Set the authenticated flag to true
                this._authenticated = true;
                // Store the user on the user service
                this._userService.user = response.user;

                return of(response);
            }),
        );
    }

    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any> {
        // Sign in using the token
        return this._httpClient.post(BASE_PATH + '/ventimetriauth/api/auth/sign-in-with-token', {
            accessToken: this.accessToken,
        }).pipe(
            catchError(() =>{
                    this.accessToken = '';
                    return of(false);
                }
            ),
            switchMap((response: any) => {
                if(response == null){
                    this.accessToken = '';
                    return of(false);
                }
                if ( response.accessToken ) {
                    this.accessToken = response.accessToken;
                }
                this._authenticated = true;
                this._userService.user = response.user;
                return of(true);
            }),
        );
    }

    /**
     * Sign out
     */
    signOut(): Observable<any> {
        localStorage.removeItem('accessToken');
        this._authenticated = false;
        return of(true);
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: { name: string; email: string; password: string; company: string }): Observable<any> {
        return this._httpClient.post(environment.apiURL + '/ventimetriauth/api/auth/sign-up', user);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: { email: string; password: string }): Observable<any>
    {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean>
    {
        // Check if the user is logged in
        if ( this._authenticated )
        {
            return of(true);
        }

        // Check the access token availability
        if ( !this.accessToken )
        {
            return of(false);
        }

        // Check the access token expire date
        if ( AuthUtils.isTokenExpired(this.accessToken) )
        {
            return of(false);
        }

        // If the access token exists, and it didn't expire, sign in using it
        return this.signInUsingToken();
    }
}
