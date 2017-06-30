import {Injectable, NgZone} from "@angular/core";
import {Subject, Observable} from "rxjs";

declare let TrezorConnect: any;

export declare enum InputScriptType {
	SPENDADDRESS = 0,    // standard p2pkh address
	SPENDMULTISIG = 1,   // p2sh multisig address
	EXTERNAL = 2,        // reserved for external inputs (coinjoin)
	SPENDWITNESS = 3,    // native segwit
	SPENDP2SHWITNESS = 4 // segwit over p2sh (backward compatible)
};

export declare enum OutputScriptType {
  PAYTOADDRESS = 0,    // used for all addresses (bitcoin, p2sh, witness)
	PAYTOSCRIPTHASH = 1, // p2sh address (deprecated; use PAYTOADDRESS)
	PAYTOMULTISIG = 2,   // only for change output
	PAYTOOPRETURN = 3,   // op_return
	PAYTOWITNESS = 4,    // only for change output
	PAYTOP2SHWITNESS = 5 // only for change output
};

export declare interface HDNodeType {
	depth: number,
	fingerprint: number,
	child_num: number,
	chain_code: string,
	private_key: string,
	public_key: string
}

export declare interface HDNodePathType {
	node: HDNodeType,    // BIP-32 node in deserialized form
	address_n: number[] // BIP-32 path to derive the key from node
};

export declare interface MultisigRedeemScriptType {
	pubkeys: HDNodePathType[], // pubkeys from multisig address (sorted lexicographically)
	signatures: string[],      // existing signatures for partially signed input
	m: number                  // "m" from n, how many valid signatures is necessary for spending
};

export declare interface TxInputType {
  address_n: number[],
  prev_hash: string,
  prev_index: number,
  script_sig: string,
  sequence: number,
  script_type: InputScriptType,
  multisig: MultisigRedeemScriptType,
  amount: number
};


export declare interface TxOutputType {
  address: string,
  address_n: number[],
  amount: number
  script_type: OutputScriptType,
  multisig: MultisigRedeemScriptType,
  op_return_data: string
};

export declare interface Recipient {
  address: string,
  amount: number
};

@Injectable()
export class TrezorConnectService {
  private _trezorConnect: any;

  /**
   *
   * @param zone
   */
    constructor(private zone: NgZone) {
        this._trezorConnect = TrezorConnect;
    }

  /**
   *
   * @param hosticon
   * @param challenge_hidden
   * @param challenge_visual
   * @returns {Observable<T>}
   */
  public requestLogin(hosticon: string, challenge_hidden: string, challenge_visual: string): Observable<any> {
    let subject = new Subject();

    this._trezorConnect.requestLogin(hosticon, challenge_hidden, challenge_visual, result => {
      if (result.success) {
        subject.next(result);
      } else {
        subject.error(result);
      }
    });

    return subject.asObservable();
  }
  
  /**
   * Retrieves BIP32 extended public key by path.
   *
   * @param path
   * @returns {Observable<T>}
   */
  public getXPubKey(path: string): Observable<any> {
    let subject = new Subject();
    
    this._trezorConnect.getXPubKey(path, result => {
      if (result.success) {
        subject.next(result);
      } else {
        subject.error(result);
      }
    });

    return subject.asObservable();
  }

  /**
   * Asks device to sign given inputs and outputs of pre-composed transaction.
   * 
   * @param inputs
   * @param outputs
   * @returns {Observable<T>}
   */
  public signTx(inputs: any[], outputs: any[]) {
    let subject = new Subject();
    
    this._trezorConnect.signTx(inputs, outputs, result => {
      if (result.success) {
        subject.next(result);
      } else {
        subject.error(result);
      }
    });

    return subject.asObservable();
  }

  /**
   * Asks device to sign Ethereum transaction.
   *
   * @param address_n
   * @param nonce
   * @param gas_price
   * @param gas_limit
   * @param to
   * @param value
   * @param data
   * @param chain_id
   * @returns {Observable<T>}
   */
  public signEthereumTx(
    address_n: string,
    nonce: string,
    gas_price: string,
    to: string,
    value: string,
    data: any,
    chain_id: string) {
    let subject = new Subject();
    
    this._trezorConnect.signEthereumTx(address_n, nonce, gas_price, to, value, data, chain_id,
      result => {
        if (result.success) {
          subject.next(result);
        } else {
          subject.error(result);
        }
      });

    return subject.asObservable();
  }

  /**
   * Requests a payment from the user's wallet
   * to a set of given recipients.
   *
   * @param recipents
   * @returns {Observable<T>}
   */
  public composeAndSignTx(
    recipients: Recipient[]) {
    let subject = new Subject();

    this._trezorConnect.composeAndSignTx(recipients,
      result => {
        if (result.success) {
          subject.next(result);
        } else {
          subject.error(result);
        }
      });

    return subject.asObservable();
  }

  /**
   * Asks device to sign a message using the private key
   * derived by given BIP32 path.
   *
   * @param path
   * @param message
   * @returns {Observable<T>}
   */
  public signMessage(
    path: string,
    message: string) {
    let subject = new Subject();

    this._trezorConnect.signMessage(path, message,
      result => {
        if (result.success) {
          subject.next(result);
        } else {
          subject.error(result);
        }
      });

    return subject.asObservable();
  }

  /**
   * Asks device to encrypt value using the private key
   * derived by given BIP32 path and the given key.
   *
   * @param path
   * @param key
   * @param value
   * @param encrypt
   * @param ask_on_encrypt
   * @param ask_on_decrypt
   * @returns {Observable<T>}
   */
  public chpherKeyValue(
    path: string,
    key: string,
    value: string,
    encrypt: boolean,
    ask_on_encrypt: boolean,
    ask_on_decrypt: boolean) {
    let subject = new Subject();

    this._trezorConnect.cipherKeyValue(
      path,
      key,
      value,
      encrypt,
      ask_on_encrypt,
      ask_on_decrypt,
      result => {
        if (result.success) {
          subject.next(result);
        } else {
          subject.error(result);
        }
      });

    return subject.asObservable();
  }

  /**
   * Gets an info of an account.
   *
   * @param description
   * @returns {Observable<T>}
   */
  public getAccountInfo(
    description: string) {
    let subject = new Subject();

    this._trezorConnect.getAccountInfo(
      description,
      result => {
        if (result.success) {
          subject.next(result);
        } else {
          subject.error(result);
        }
      });

    return subject.asObservable();
  }

}
