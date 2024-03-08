import { Review } from '@prisma/client';

//function to sort review
export const sortReviews = function (
  reviews: (Review & { user: { name: string; imgUrl: string } })[]
) {
  return reviews.sort(
    (
      a: Review & { user: { name: string; imgUrl: string } },
      b: Review & { user: { name: string; imgUrl: string } }
    ) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};
