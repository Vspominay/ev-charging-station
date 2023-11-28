import { inject, Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';

import abi from './contract-abi.json';

declare var window: any;

@Injectable({
  providedIn: 'root'
})
export class Web3Service {
  private readonly web3!: Web3;
  private readonly contract!: Contract<any>;
  private readonly contractAddress = '0xBbb3012A8Bc455072a66490194ee9Cd465c583c0';

  private readonly ngZone = inject(NgZone);

  constructor() {
    if (window.web3) {
      this.web3 = new Web3(window.ethereum);
      this.contract = new this.web3.eth.Contract(abi, this.contractAddress);

      window.ethereum.enable().catch((err: any) => {
        console.warn(err);
      });
    } else {
      console.warn('Metamask not found');
    }

  }

  getWeb3(): Web3 {
    return this.web3;
  }

  getAccount(): Promise<string> {
    return this.web3.eth.getAccounts().then((accounts: string[]) => accounts[0] || '');
  }

  async executeTransaction(fnName: string, ...args: any[]): Promise<void> {
    const account = await this.getAccount();

    (this.contract.methods[fnName] as any)(...args).send({ from: account });
  }

  async call(fnName: string, ...args: any[]): Promise<any> {
    const account = await this.getAccount();

    return (this.contract.methods[fnName] as any)(...args).call({ from: account });
  }

  onEvents(event: string) {
    return new Observable((observer) => {
      this.ngZone.run(() => {
        this.contract.events[event]().on('data', (data: any) => observer.next({
          event: data.event,
          payload: data.returnValues
        }));
      });
    });
  }
}
