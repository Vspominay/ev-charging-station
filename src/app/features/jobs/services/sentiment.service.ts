import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import { combineLatest, from, shareReplay } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SentimentService {
  readonly http = inject(HttpClient);

  private model$ = this.loadModel().pipe(
    shareReplay(1)
  );

  private metadata$ = this.loadMetadata().pipe(
    shareReplay(1)
  );

  loadModel() {
    return from(tf.loadLayersModel(
      'https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/model.json'
    ));
  }

  loadMetadata() {
    return this.http.get<any>(
      'https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/metadata.json'
    ).pipe(
      map((json) => json)
    );
  }

  padSequences(sequences: any, metadata: any) {
    return sequences.map((seq: any) => {
      if (seq.length > metadata.max_len) {
        seq.splice(0, seq.length - metadata.max_len);
      }
      if (seq.length < metadata.max_len) {
        const pad = [];
        for (let i = 0; i < metadata.max_len - seq.length; ++i) {
          pad.push(0);
        }
        seq = pad.concat(seq);
      }
      return seq;
    });
  }

  predict(text: string[]) {
    return combineLatest([
      this.model$,
      this.metadata$
    ]).pipe(
      map(([model, metadata]) => {

        const inputText = text.map((d: string) => metadata.word_index[d]);

        const paddedSequences = this.padSequences([inputText], metadata);

        const input = tf.tensor2d(paddedSequences, [1, metadata.max_len]);

        const predictOut = model.predict(input) as tf.Tensor<tf.Rank>;

        const score = predictOut.dataSync()[0];

        predictOut.dispose();

        return score;
      })
    );
  }
}
