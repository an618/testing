/**
 * Types for Participants API
 */

export interface Participant {
  accountNumber: string;
  fullName: string;
  status: string;
  portfolioType: string;
  balance: string;
  vestedStatus: string;
}

export interface ParticipantsListParams {
  page?: number;
  size?: number;
  search?: string;
}

export interface ParticipantsListResponse {
  content: Participant[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  first: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  empty: boolean;
}

