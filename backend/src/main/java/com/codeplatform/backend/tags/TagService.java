package com.codeplatform.backend.tags;

import com.codeplatform.backend.exception.AppException;
import com.codeplatform.backend.exception.ResourceNotFoundException;
import com.codeplatform.backend.tags.dto.CreateTagRequest;
import com.codeplatform.backend.tags.dto.TagResponse;
import com.codeplatform.backend.tags.dto.UpdateTagRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class TagService {

    private final TagRepository repository;
    private  final  TagMapper tagMapper;
    public TagResponse create(CreateTagRequest request)  {

        if(repository.existsByNameIgnoreCase(request.getName())){
            throw new AppException("Tag already exists", HttpStatus.ALREADY_REPORTED);
        }

        TagEntity tag = TagEntity.builder()
                .name(request.getName())
                .build();

        repository.save(tag);

        return tagMapper.toDto(tag);
    }

    public List<TagResponse> getAll(){


        List<TagEntity> tagList =  repository.findAllByOrderByNameAsc();


        return  tagMapper.toTagList(tagList);


    }

    public TagResponse update(Long id, UpdateTagRequest request){

        TagEntity tag = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tag not found"));

        tag.setName(request.getName());

        return tagMapper.toDto(tag);
    }

    public void delete(Long id){

        repository.deleteById(id);
    }


}
