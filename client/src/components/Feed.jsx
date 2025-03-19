import React from 'react';

const Feed = () => {
  const feedItems = [
    { id: 1, content: 'This is the first feed item' },
    { id: 2, content: 'This is the second feed item' },
    { id: 3, content: 'This is the third feed item' },
  ];

  return (
    <div>
      <h1>Feed</h1>
      <ul>
        {feedItems.map(item => (
          <li key={item.id}>{item.content}</li>
        ))}
      </ul>
    </div>
  );
};

export default Feed;