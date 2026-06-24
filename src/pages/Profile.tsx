import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';

export const Profile = () => {
  const { username } = useParams();
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState<any>(null);
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState<File | null>(null);

  const fetchProfile = async () => {
    const { data } = await API.get(`/users/${username}`);
    setProfile(data);
  };

  useEffect(() => { fetchProfile(); }, [username]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return;
    const formData = new FormData();
    formData.append('image', image);
    formData.append('caption', caption);
    formData.append('userId', user.id);

    await API.post('/posts', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    setCaption('');
    setImage(null);
    fetchProfile();
  };

  if (!profile) return <div className="p-8">Загрузка...</div>;

  return (
    <div className="mx-auto max-w-4xl p-4">
      <div className="flex items-center gap-6 border-b pb-6">
        <div className="h-24 w-24 rounded-full bg-gray-300"></div>
        <div>
          <h1 className="text-2xl font-bold">@{profile.username}</h1>
          <div className="flex gap-4 text-sm text-gray-600 mt-2">
            <span>Подписчики: {profile._count.followers}</span>
            <span>Подписки: {profile._count.following}</span>
          </div>
        </div>
      </div>

      {user?.username === username && (
        <form onSubmit={handleUpload} className="my-6 border p-4 rounded bg-gray-50 space-y-2">
          <h3 className="font-semibold">Выложить новое фото</h3>
          <input type="file" accept="image/*" onChange={e => setImage(e.target.files?.[0] || null)} required />
          <input type="text" placeholder="Описание..." value={caption} onChange={e => setCaption(e.target.value)} className="w-full border p-2 rounded bg-white" />
          <button type="submit" className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600">Опубликовать</button>
        </form>
      )}

      <div className="grid grid-cols-3 gap-4 mt-6">
        {profile.posts.map((post: any) => (
          <div key={post.id} className="border rounded overflow-hidden shadow-sm bg-white">
            <img src={`https://my-social-network-wine.vercel.app${post.imageUrl}`} alt="" className="w-full h-64 object-cover" />
            <p className="p-2 text-sm text-gray-700">{post.caption}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
