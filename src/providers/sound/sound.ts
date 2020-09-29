import { Injectable } from '@angular/core';
import { NativeAudio } from "@ionic-native/native-audio";
import { Platform } from "ionic-angular";
import { WidgetProvider } from "../widget/widget";

@Injectable()
export class SoundProvider {
  audioType: string = 'html5';
  sounds: any = [];
  activeTouchSound: boolean = true;
  constructor(private platform: Platform, private nativeAudio: NativeAudio, public widget: WidgetProvider) {
    if (platform.is('cordova')) {
      this.audioType = 'native';
    }
    this.preload('buttonClick', 'assets/sound/touchButton.mp3');
    this.preload('clear', 'assets/sound/trashClear.mp3');
    this.preload('success', 'assets/sound/success.mp3');
  }

  preload(key, asset): void {
    if(this.audioType === 'html5') {
      let audio = {
        key: key,
        asset: asset,
        type: 'html5'
      };
      this.sounds.push(audio);
    } else {
      this.nativeAudio.preloadSimple(key, asset).then();
      let audio = {
        key: key,
        asset: key,
        type: 'native'
      };
      this.sounds.push(audio);
    }
  }

  play(key): void {
    let audio = this.sounds.find((sound) => {
      return sound.key === key;
    });
    if (audio.type === 'html5') {
      let audioAsset = new Audio(audio.asset);
      audioAsset.play().then();
    } else {
      this.nativeAudio.play(audio.asset).then((res) => {
        console.log(res);
      }, (err) => {
        console.log('else=>'+err);
      });
    }
  }

}
