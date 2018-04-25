import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';
import { Events } from 'ionic-angular';

export enum ConnectionStatusEnum {
  Online,
  Offline
}

@Injectable()
export class NetworkProvider {
  previousStatus;

  constructor(public network: Network,
    public eventCtrl: Events) { }

  public initializeNetworkEvents(): void {
    this.network.onDisconnect().subscribe(() => {
      if (this.previousStatus === ConnectionStatusEnum.Online || this.previousStatus === undefined) {
        this.eventCtrl.publish('network:offline');
      }
      this.previousStatus = ConnectionStatusEnum.Offline;
    });
    this.network.onConnect().subscribe(() => {
      if (this.previousStatus === ConnectionStatusEnum.Offline  || this.previousStatus === undefined) {
        this.eventCtrl.publish('network:online');
      }
      this.previousStatus = ConnectionStatusEnum.Online;
    });
  }

  public isOnline() {
    // we need to get the inital status
    if (this.previousStatus === undefined) {
      return this.network.type === 'none' ? false : true;
    } 
    return this.previousStatus === ConnectionStatusEnum.Online ? true : false;
  }

}
