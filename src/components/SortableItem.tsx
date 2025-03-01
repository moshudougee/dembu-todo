/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type SortableItemProps = {
    id: string;
    children: (props: { attributes: any; listeners: any }) => React.ReactNode; // Pass attributes and listeners as arguments
}

const SortableItem = ({ id, children }: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div 
        ref={setNodeRef} 
        style={style} 
        className={isDragging ? 'opacity-50' : ''}
    >
      {children({ attributes, listeners })}
    </div>
  );
};

export default SortableItem;