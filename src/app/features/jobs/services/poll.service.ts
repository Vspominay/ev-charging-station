import { computed, effect, inject, Injectable, signal, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { first, forkJoin, from, mergeMap, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { fromAscii, toAscii } from 'web3-utils';
import { Web3Service } from '../../../core/blockchain/web3.service';
import { TCreatePoll, TPoll, TPollList } from '../../../types';

@Injectable({
  providedIn: 'root'
})
export class PollService {
  private readonly web3 = inject(Web3Service);

  private readonly $allPolls = signal([] as Array<TPollList>);
  private readonly $polls: Signal<Array<TPollList>> = computed(() => this.$allPolls() || []);
  private readonly $listenToPolls = toSignal(this.web3.onEvents('PollCreated'));
  private readonly $listenPollVoted = toSignal(this.web3.onEvents('PollVoted').pipe(map((data: any) => data.payload['0'])));
  private readonly $selectionChanged = signal<TPoll | null>(null);


  readonly $viewModel = computed(() => ({
    polls: this.$polls(),
    selectedPoll: this.$selectionChanged()
  }));


  constructor() {
    effect(() => {
      this.$listenToPolls();

      this.getPolls().subscribe((polls) => this.$allPolls.set(polls));
    });

    effect(() => {
      const pollId = this.$listenPollVoted() as number;

      if (pollId === undefined) return;

      this.loadPoll(pollId);
      this.getPolls().subscribe((polls) => this.$allPolls.set(polls));
    });
  }

  getPolls(): Observable<TPollList[]> {
    return from(this.web3.call('getPolls'))
      .pipe(
        map((pollsData) => {
          const ids = pollsData[0];
          const questions = pollsData[1];
          const thumbnails = pollsData[2];
          const totalVotes = pollsData[3];

          const polls: TPollList[] = [];

          console.log(pollsData);

          for (let i = 0; i < ids.length; i++) {
            polls.push({
              id: ids[i],
              question: questions[i],
              thumbnail: thumbnails[i],
              totalVotes: totalVotes[i].reduce((acc: number, curr: number) => acc + parseInt(curr + ''), 0)
            });
          }

          return polls;
        }));
  }

  loadPoll(pollId: number): void {
    const getPoll$ = from(this.web3.call('getPoll', pollId)).pipe(map(this.normalizePoll));
    const getVoter$ = (acc: any) => from(this.web3.call('getVoter', acc)).pipe(map(this.normalizeVoter));

    from(this.web3.getAccount())
      .pipe(
        mergeMap((acc) => forkJoin({
          poll: getPoll$,
          voter: getVoter$(acc)
        })),
        map(({ poll, voter }) => {
          return {
            ...poll,
            voted: voter.voteIds.includes(parseInt(pollId + ''))
          };
        }),
        first()
      ).subscribe((poll) => this.$selectionChanged.set(poll));
  }


  private normalizeVoter(voter: any) {
    return {
      id: voter[0],
      voteIds: voter[1].map((id: any) => parseInt(id))
    };
  }

  private normalizePoll(poll: any): TPoll {
    return {
      id: poll[0],
      question: poll[1],
      thumbnail: poll[2],
      description: poll[3],
      results: poll[4].map((result: any) => parseInt(result)),
      options: poll[5].map((option: any) => toAscii(option).replace(/\u0000/g, '')),
    };
  }


  vote(pollId: number, voteNumber: number) {
    return this.web3.executeTransaction('vote', pollId, voteNumber);
  }

  createPoll({ question, options, thumbnail, description }: TCreatePoll) {
    this.web3.executeTransaction('createPoll', question, description, thumbnail || '', options.map(fromAscii));
  }
}
