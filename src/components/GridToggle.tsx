'use client';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { toggleView } from '@/redux/productsSlice';
import { Grid, List } from 'lucide-react';

export default function GridToggle() {
  const dispatch = useDispatch();
  const view = useSelector((state: RootState) => state.productsDetails.view);

  return (
    <div className="flex gap-2">
      <button
        onClick={() => dispatch(toggleView())}
        className={`p-2 border rounded-md ${view === 'grid' ? 'bg-gray-200' : 'bg-white'
          }`}
      >
        <Grid className="w-4 h-4" />
      </button>
      <button
        onClick={() => dispatch(toggleView())}
        className={`p-2 border rounded-md ${view === 'list' ? 'bg-gray-200' : 'bg-white'
          }`}
      >
        <List className="w-4 h-4" />
      </button>
    </div>
  );
}
