import { SpinnerLoading } from '@/components/spinner-loading';

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-screen">
      <SpinnerLoading />
    </div>
  );
}
