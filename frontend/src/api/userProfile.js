import api from "./api";
import axios from "axios";



export const UserProfileAPI = {
    getProfile: () => api.get('/auth/profiles/'),

    updateProfile: (id, data) => api.put(`auth/profiles/${id}/`, data),

    patchProfile: (id, data) => api.patch(`auth/profiles/${id}/`, data),
}
