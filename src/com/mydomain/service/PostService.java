package com.mydomain.service;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.mongodb.morphia.Datastore;

import com.mydomain.dao.PostDao;
import com.mydomain.model.Post;

@Path("/post")
public class PostService {

	public PostDao postDao = new PostDao(); 
	
	public void setPostDao(PostDao postDao){
		this.postDao = postDao;
	}
	
	/*@GET
	@Path("/{param}")
	@Produces({MediaType.APPLICATION_JSON})
	public Post getPost(@PathParam("param") String title) {
		return postDao.getPost(title);
	}
*/
	@GET
	@Produces({MediaType.APPLICATION_JSON})
	public List<Post> getPosts() {
		return postDao.getPosts();
	}
	
	@GET
	@Path("/{param}")
	@Produces({MediaType.APPLICATION_JSON})
	public List<Post> getPostsByCategory(@PathParam("param") String category) {
		return postDao.getPostsByCategory(category);
	}
	
	@GET
	@Path("/{category}/{tag}")
	@Produces({MediaType.APPLICATION_JSON})
	public List<Post> getPostsByCategoryAndtag(@PathParam("category") String category,@PathParam("tag") String tag) {
		return postDao.getPostsByCategoryAndtag(category,tag);
	}
	
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	public void createPost(Post p){
		postDao.createPost(p);
	}
	

	@PUT
	@Consumes(MediaType.APPLICATION_JSON)
	public void updatePost(Post p){
		postDao.updatePost(p);
	}

}