import React from 'react';
import {Box} from 'reflexbox';
import {Button} from 'antd';
import {uniq, identity} from 'lodash';

export default function QuickTagSelector({tags, resultKey, onSelect}) {
  const uniqueTags = uniq(tags.map((tag) => tag.result[resultKey]).filter(identity)).sort();
  return (
    <Box p={1}>
      {
        uniqueTags.map((tag) => (
          <Button
            size="small"
            key={tag}
            style={{margin: '3px'}}
            onClick={() => onSelect(tag)}
          >
            {tag}
          </Button>
        ))
      }
    </Box>
  );
}
