import {NgModule, ModuleWithProviders} from "@angular/core";
import {TrezorConnectService} from "./trezor-connect.service";

@NgModule({
    imports: [],
    exports: [],
    declarations: [],
    providers: [],
    entryComponents: []
})
export class TrezorConnectModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: TrezorConnectModule,
            providers: [TrezorConnectService]
        };
    }
}

