type TBasePoll = {
  id: number,
  question: string,
  thumbnail: string,
}

export type TPoll = TBasePoll & {
  results: number[],
  options: string[],
  description: string,
  voted?: boolean,
}

export type TPollList = TBasePoll & {
  totalVotes?: number;
}

export type TCreatePoll = Pick<TPoll, 'question' | 'options' | 'thumbnail' | 'description'>;
