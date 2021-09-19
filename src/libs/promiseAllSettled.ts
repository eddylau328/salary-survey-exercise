enum PromiseStatus {
  Success = "fulfilled",
  Fail = "rejected",
}

interface PromiseFulfilledResult<T> {
  status: PromiseStatus;
  value: T;
}
interface PromiseRejectedResult {
  status: PromiseStatus;
  reason: Error;
}

type PromiseSettledResult<T> =
  | PromiseFulfilledResult<T>
  | PromiseRejectedResult;

function allSettled<T>(
  promises: Promise<T>[]
): Promise<PromiseSettledResult<T>[]> {
  const wrappedPromises: Promise<PromiseSettledResult<T>>[] = promises.map(
    (p) =>
      Promise.resolve(p).then(
        (val: T) => ({ status: PromiseStatus.Success, value: val }),
        (err: Error) => ({ status: PromiseStatus.Fail, reason: err })
      )
  );
  return Promise.all(wrappedPromises);
}

export default allSettled;
export {
  PromiseStatus,
  PromiseSettledResult,
  PromiseRejectedResult,
  PromiseFulfilledResult,
};
