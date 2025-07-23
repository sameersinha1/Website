'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Phone, Calendar, Code, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';

type RegistrationFormProps = {
  isOpen: boolean;
  onClose: () => void;
};

const RegistrationForm: React.FC<RegistrationFormProps> = ({ isOpen, onClose }) => {
  type FormData = {
    fullName: string;
    email: string;
    phone: string;
    year: string;
    branch: string;
    experience: string;
    interests: string[];
    githubProfile: string;
    previousEvents: boolean;
  };

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    year: '',
    branch: '',
    experience: '',
    interests: [],
    githubProfile: '',
    previousEvents: false
  });

  type Errors = {
    fullName?: string;
    email?: string;
    phone?: string;
    year?: string;
    branch?: string;
    experience?: string;
    interests?: string;
    githubProfile?: string;
    previousEvents?: string;
    [key: string]: string | undefined;
  };

  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const programmingInterests = [
    'Web Dev', 'Mobile', 'AI/ML', 'Data Science',
    'Cybersecurity', 'Game Dev', 'DevOps', 'Blockchain'
  ];

  const validateForm = () => {
    const newErrors: Errors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Name is required';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    const phoneRegex = /^[\d\s\-\(\)]{10,}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Invalid phone number';
    }

    if (!formData.year) {
      newErrors.year = 'Year is required';
    }

    if (!formData.branch.trim()) {
      newErrors.branch = 'Branch is required';
    }

    if (!formData.experience) {
      newErrors.experience = 'Experience level is required';
    }

    if (formData.interests.length === 0) {
      newErrors.interests = 'Select at least one interest';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    const name = target.name;

    if (target instanceof HTMLInputElement && target.type === 'checkbox') {
      const checked = target.checked;
      const value = target.value;
      if (name === 'interests') {
        const updatedInterests = checked
          ? [...formData.interests, value]
          : formData.interests.filter(interest => interest !== value);

        setFormData(prev => ({
          ...prev,
          interests: updatedInterests
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: checked
        }));
      }
    } else {
      const value = target.value;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true); // Optional: show loading indicator

  const data = {
    FullName: formData.fullName,
    Email: formData.email,
    Phone: formData.phone,
    Year: formData.year,
    Branch: formData.branch,
    Programming_Experience: formData.experience,
    Interests: formData.interests.join(", "),
    GitHub_Profile: formData.githubProfile,
    boolean_before: formData.previousEvents,
  };

  try {
  fetch("http://localhost:8000/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data)
})

    if (!res.ok) {
      const { error } = await res.json();
      throw new Error(error || "Failed to register");
    }

    setSubmitSuccess(true);
    setTimeout(() => {
      onClose(); // Close the modal
      setSubmitSuccess(false);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        year: '',
        branch: '',
        experience: '',
        interests: [],
        githubProfile: '',
        previousEvents: false,
      });
    }, 2000);
  } catch (error) {
    console.error("Submission error:", error);
    setSubmitSuccess(false);
  } finally {
    setIsSubmitting(false);
  }
};

  
  const inputClass = (fieldName: keyof FormData) => `
    w-full px-4 py-3 bg-slate-800/60 border rounded-xl text-white placeholder-slate-400 
    transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-slate-500/50 
    focus:border-slate-500 hover:bg-slate-800/80
    ${errors[fieldName] ? 'border-red-500/50 bg-red-500/5' : 'border-slate-600/50'}
  `;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Header */}
            <div className="sticky top-0 bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 p-6 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    <Code className="mr-2 text-slate-400" size={24} />
                    Join Programming Club
                  </h2>
                  <p className="text-slate-400 text-sm mt-1">Start your coding journey with us!</p>
                </div>
                
                <motion.button
                  onClick={onClose}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl transition-all duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X size={20} />
                </motion.button>
              </div>
            </div>

            {/* Success State */}
            <AnimatePresence>
              {submitSuccess && (
                <motion.div
                  className="absolute inset-0 bg-slate-900/98 backdrop-blur-xl rounded-3xl flex items-center justify-center z-10"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <div className="text-center">
                    <motion.div
                      className="mx-auto mb-4 w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    >
                      <CheckCircle className="text-green-400" size={32} />
                    </motion.div>
                    <motion.h3 
                      className="text-2xl font-bold text-white mb-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      Welcome to the Club! 🎉
                    </motion.h3>
                    <motion.p 
                      className="text-slate-400"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      You&#39;ll receive a confirmation email shortly.
                    </motion.p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    <User className="inline mr-1" size={14} />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={inputClass('fullName')}
                    placeholder="Enter your name"
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-400 flex items-center">
                      <AlertCircle className="mr-1" size={12} />
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    <Mail className="inline mr-1" size={14} />
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={inputClass('email')}
                    placeholder="your@email.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-400 flex items-center">
                      <AlertCircle className="mr-1" size={12} />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    <Phone className="inline mr-1" size={14} />
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={inputClass('phone')}
                    placeholder="(555) 123-4567"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-400 flex items-center">
                      <AlertCircle className="mr-1" size={12} />
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Academic Year */}
                <div>
                  <label htmlFor="year-select" className="block text-sm font-medium text-slate-300 mb-2">
                    <Calendar className="inline mr-1" size={14} />
                    Year *
                  </label>
                  <select
                    id="year-select"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className={inputClass('year')}
                    aria-label="Academic Year"
                  >
                    <option value="">Select year</option>
                    <option value="1st">1st Year</option>
                    <option value="2nd">2nd Year</option>
                    <option value="3rd">3rd Year</option>
                    <option value="4th">4th Year</option>
                    <option value="graduate">Graduate</option>
                  </select>
                  {errors.year && (
                    <p className="mt-1 text-sm text-red-400 flex items-center">
                      <AlertCircle className="mr-1" size={12} />
                      {errors.year}
                    </p>
                  )}
                </div>

                {/* Branch */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Branch/Major *
                  </label>
                  <input
                    type="text"
                    name="branch"
                    value={formData.branch}
                    onChange={handleInputChange}
                    className={inputClass('branch')}
                    placeholder="Computer Science, IT, etc."
                  />
                  {errors.branch && (
                    <p className="mt-1 text-sm text-red-400 flex items-center">
                      <AlertCircle className="mr-1" size={12} />
                      {errors.branch}
                    </p>
                  )}
                </div>

                {/* Experience */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Programming Experience *
                  </label>
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className={inputClass('experience')}
                    aria-label="Programming Experience"
                  >
                    <option value="">Select level</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="expert">Expert</option>
                  </select>
                  {errors.experience && (
                    <p className="mt-1 text-sm text-red-400 flex items-center">
                      <AlertCircle className="mr-1" size={12} />
                      {errors.experience}
                    </p>
                  )}
                </div>

                {/* Interests */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-3">
                    Interests * (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {programmingInterests.map((interest) => (
                      <label
                        key={interest}
                        className="flex items-center p-2 bg-slate-800/40 border border-slate-700/30 rounded-lg hover:bg-slate-800/60 transition-all cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          name="interests"
                          value={interest}
                          checked={formData.interests.includes(interest)}
                          onChange={handleInputChange}
                          className="mr-2 w-3 h-3 text-slate-500 bg-slate-700/50 border-slate-600 rounded focus:ring-slate-500"
                        />
                        <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                          {interest}
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors.interests && (
                    <p className="mt-2 text-sm text-red-400 flex items-center">
                      <AlertCircle className="mr-1" size={12} />
                      {errors.interests}
                    </p>
                  )}
                </div>

                {/* GitHub (Optional) */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    GitHub Profile (Optional)
                  </label>
                  <input
                    type="url"
                    name="githubProfile"
                    value={formData.githubProfile}
                    onChange={handleInputChange}
                    className={inputClass('githubProfile')}
                    placeholder="https://github.com/username"
                  />
                </div>

                {/* Previous Events */}
                <div className="md:col-span-2">
                  <label className="flex items-center p-3 bg-slate-800/30 border border-slate-700/30 rounded-lg hover:bg-slate-800/50 transition-all cursor-pointer">
                    <input
                      type="checkbox"
                      name="previousEvents"
                      checked={formData.previousEvents}
                      onChange={handleInputChange}
                      className="mr-3 w-4 h-4 text-slate-500 bg-slate-700/50 border-slate-600 rounded focus:ring-slate-500"
                    />
                    <div>
                      <span className="text-slate-300 font-medium text-sm">
                        I&#39;ve attended programming club events before
                      </span>
                      <p className="text-xs text-slate-400 mt-1">
                        Check if you&#39;re already familiar with our community
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-slate-700/30">
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-6 bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 hover:from-slate-500 hover:via-slate-600 hover:to-slate-700 text-white font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-slate-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Joining...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Sparkles className="mr-2" size={16} />
                      Join Programming Club
                    </div>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RegistrationForm;