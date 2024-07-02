import React from 'react'
import Skeleton from '@mui/material/Skeleton';

const SkeletonCards = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'start',
        alignItems: 'center',
        width: '95%',
        gap: '5px'
      }}
    >

      <Skeleton variant="rectangular" width={400} height={70} style={{margin: '10px'}} />

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '30px'
        }}
      >
        {[1, 2, 3, 4, 5, 6, 7,8].map(item => <Skeleton key={item} variant="rectangular" width={298} height={300} />)}
      </div>
    </div>
  )
}

export default SkeletonCards