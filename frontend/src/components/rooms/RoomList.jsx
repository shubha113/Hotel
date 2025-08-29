import RoomCard from './RoomCard';

const RoomList = ({ rooms }) => {
  return (
    <div className="room-list">
      <div className="room-grid">
        {rooms.map((room) => (
          <RoomCard key={room._id} room={room} />
        ))}
      </div>
    </div>
  );
};

export default RoomList;