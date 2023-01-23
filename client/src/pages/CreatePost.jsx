import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { preview } from '../assets'
import { getRandomPrompt } from '../utils'
import FormField from '../components/FormField'
import Loader from '../components/Loader'

// export const URL = (process.env.NODE_ENV === 'production')? 
// 'https://eldars-image-generating-dall-e-clone.onrender.com/api/v1' :  
// 'http://localhost:8080/api/v1'

const CreatePost = () => {

  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    prompt: '',
    size: '1024x1024',
    photo: ''
  })
  const [generatingIMG, setGeneratingIMG] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const generateImage = async () => {
    if (form.prompt) {
      try {
        setGeneratingIMG(true)
        const response = await fetch('https://eldars-image-generating-dall-e-clone.onrender.com/api/v1/dalle', 
        { method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: form.prompt, size: form.size })
        })

        const data = await response.json()
        setForm({...form, photo: `data:image/jpeg;base64,${data.photo}`})

      } catch (error) {
        console.log(error)
      } finally {
        setGeneratingIMG(false)
      }
    } else {
      console.log('Please enter a prompt')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.prompt && form.photo) {
      setLoading(true)
      try {
        const response = await fetch('https://eldars-image-generating-dall-e-clone.onrender.com/api/v1/posts',
        { method: 'POST',
          headers: {
            'Content-Type' : 'application/json',
          },
          body: JSON.stringify(form)
        })

        await response.json()
        navigate('/')

      } catch (error) {
        console.log('Something went wrong', error);
      } finally {
        setLoading(false)
      }
    } else {
      alert('Please enter a prompt and generate an image')
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value})
  }

  const handleSurpriseMe = () => {

      const randomPrompt = getRandomPrompt(form.prompt)
      setForm({ ...form, prompt: randomPrompt})
  }

  return (
    <section className='max-w-7xl mx-auto'>
         <div>
            <h1 className='font-extrabold text-[#222328] text-[32px]'>Create</h1>
            <p className='mt-2 text-[#666e75] text-[16px] max-w-[500px]'>Create imaginitve and visually stunning images through DALL-E AI and share them with the community</p>
        </div>
        <form className='mt-16 max-w-3xl' onSubmit={handleSubmit}>
          <div className='flex flex-col gap-5'>
            <FormField 
              labelName='Your name'
              type='text'
              name='name'
              placeholder='John Doe'
              value={form.name}
              handleChange={handleChange}
            /> 
            <label className='block text-sm font-medium text-gray-900'>Image size</label>
            <select 
              name='size'
              placeholder='1024x1024'
              value={form.size}
              onChange={handleChange}
              className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#4649ff]
       focus:border-[#4649ff] outline-none block w-full p-3'
       
            >
              <option value='256x256'>256x256</option>
              <option value='512x512'>512x512</option>
              <option value='1024x1024'>1024x1024</option>
              </select> 
            <FormField 
              labelName='Prompt'
              type='text'
              name='prompt'
              placeholder='panda mad scientist mixing sparkling chemicals, digital art'
              value={form.prompt}
              handleChange={handleChange}
              isSurpriseMe
              handleSurpriseMe={handleSurpriseMe}
            /> 

            <div className='relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
            focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center' >
              {form.photo ? (
                <img src={form.photo} alt={form.prompt} className='w-full h-full object-contain'/>
              ): (
                <img src={preview} alt={preview} className='w-9/12 h-9/12 object-contain opacity-40' /> 
              )}

              {generatingIMG && (
                <div className='absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg'>
                    <Loader /> 
                </div>

              )}
            </div>

          </div>
          <div className='mt-5 flex gap-5'>
            <button type='button' onClick={generateImage}
            className='text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5'
            >{generatingIMG ? 'Generating...' : 'Generate'}</button>
          </div>
          <div className='mt-10'>
            <p className='mt-2 text-[#666e75] text[14px]'>Once you have created the image you want, you can share it with others in the community</p>
            <button type='submit' className='mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center'>{loading ? 'Sharing... ' : 'Share with the community' }</button>
          </div>
        </form>
    </section>
  )
}

export default CreatePost
