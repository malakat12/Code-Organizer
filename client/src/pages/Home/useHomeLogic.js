import { request } from "../../utils/remote/axios";
import { requestMethods } from "../../utils/enums/request.methods";
import { useEffect, useState } from "react";

const useHomeLogic = () => {
  const [photos, setPhotos] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newPhoto, setNewPhoto] = useState({ title: "", description: "", tags: "", photo: null });
  const [editingPhoto, setEditingPhoto] = useState(null);

  useEffect(() => {
    getPhotos();
  }, []);


  
  const getPhotos = async () => {
    const user_id = localStorage.getItem("user_id");
    if (!user_id) {
      console.error("User ID not found. User might not be logged in.");
      return;
    }
    
    const response = await request({
      method: requestMethods.GET,
      route: `/getAll?user_id=${user_id}`,
    });

    setPhotos(response.error ? [] : response);
  };


  
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function () {
      const base64Image = reader.result;
      setNewPhoto((prev) => ({ ...prev, photo: base64Image })); 
    };
    reader.readAsDataURL(file);
  };

  const uploadPhoto = async () => {
    console.log("Uploading photo...");
    const user_id = localStorage.getItem("user_id");
    if (!user_id) {
      console.error("User ID not found. User might not be logged in.");
      return;
    }

    const formData = {
      user_id: user_id,
      title: newPhoto.title,
      description: newPhoto.description,
      tags: newPhoto.tags,
      photo: newPhoto.photo,
    };

    console.log("Payload:", formData);
    try {
      const response = await request({
        method: requestMethods.POST,
        route: `/upload`,
        body: JSON.stringify(formData),
      });

      console.log("Server Response:", response);
      getPhotos(); 
      setNewPhoto({ title: "", description: "", tags: "", photo: null });
      setShowUploadModal(false);
    } catch (error) {
      console.error("Upload Error:", error);
    }
  };

  const deletePhoto = async (photoId) => {
    try {
      const response = await request({
        method: requestMethods.DELETE,
        route: `/delete`,
        body: JSON.stringify({ id: photoId })
      });

      if (response && response.success) {
        setPhotos((prevPhotos) => prevPhotos.filter((photo) => photo.id !== photoId));
      } else {
        console.error("Failed to delete:", response.message);
      }    } catch (error) {
      console.error("Delete Error:", error);
    }
  };

  const startEditing = (photo) => {
    setEditingPhoto(photo);
    setShowUploadModal(true);
    setNewPhoto({
      title: photo.title,
      description: photo.description,
      tags: photo.tags,
      photo: photo.photo,
    });
  };

  const updatePhoto = async () => {
    if (!editingPhoto) return;

    try {
      const response = await request({
        method: requestMethods.PUT,
        route: `/update`,
        body: JSON.stringify({
          id: editingPhoto.id,
          title: newPhoto.title,
          description: newPhoto.description, 
          tags: newPhoto.tags,
          photo: newPhoto.photo || editingPhoto.photo, 
        }),
      });

      console.log("Update Response:", response);
      getPhotos();
      setShowUploadModal(false);
      setNewPhoto({ title: "", description: "", tags: "" , photo: "" });
      setEditingPhoto(null);
    } catch (error) {
      console.error("Update Error:", error);
    }
  };

  return {
    photos,
    showUploadModal,
    setShowUploadModal,
    newPhoto,
    uploadPhoto,
    setNewPhoto,
    handleFileChange, 
    deletePhoto, 
    startEditing, 
    updatePhoto,
    editingPhoto,
  
  };
};

export default useHomeLogic;
