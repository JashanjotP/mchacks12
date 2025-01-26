'use client'

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Leaf, FileText, SearchCheck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const LeaseAnalysisApp = () => {
  const [leaseText, setLeaseText] = useState('');
  const [analysisResult, setAnalysisResult] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeLease = () => {
    // Simulate AI analysis with a loading state
    setIsAnalyzing(true);
    
    // Clear previous result
    setAnalysisResult('');

    // Simulated analysis delay
    setTimeout(() => {
      const analysis = `After carefully reviewing the lease agreement, our AI has identified several key insights. The lease covers a two-bedroom apartment with a monthly rent of $2,500, situated in a metropolitan area. Notable terms include a 12-month lease duration, a $3,000 security deposit, and comprehensive maintenance clauses. The agreement outlines specific provisions for tenant responsibilities, utility management, and noise restrictions, reflecting a balanced approach to residential tenancy.`;
      
      setAnalysisResult(analysis);
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gradient-to-br from-amber-50 to-amber-100 p-4 font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="shadow-2xl border-2 border-amber-200/70 rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-amber-100 to-amber-200 border-b-2 border-amber-300/50 flex items-center justify-between p-6">
            <div className="flex items-center space-x-4">
              <Leaf className="text-amber-700" size={32} />
              <CardTitle className="text-3xl font-extrabold text-amber-900 tracking-tight">
                What's on your lease?
              </CardTitle>
            </div>
            <Sparkles className="text-amber-600 animate-pulse" size={28} />
          </CardHeader>
          
          <CardContent className="p-8 space-y-6">
          <div className="space-y-4">
  <div className="flex items-center space-x-4 mb-2">
    <FileText className="text-amber-600" size={24} />
    <h2 className="text-xl font-semibold text-amber-800">
      Upload Lease Document
    </h2>
  </div>
  
  <label 
    htmlFor="lease-upload" 
    className="block w-full cursor-pointer"
  >
    <div className="flex items-center justify-center p-6 border-2 border-dashed border-amber-300 rounded-xl bg-white hover:bg-amber-50 transition-all duration-300 ease-in-out hover:border-amber-500 group">
      <div className="text-center">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="mx-auto h-12 w-12 text-amber-400 group-hover:text-amber-600 transition-colors" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
          />
        </svg>
        <p className="mt-2 text-sm text-amber-600 group-hover:text-amber-800">
          Click to upload PDF or DOCX
        </p>
        <p className="text-xs text-amber-500">
          Max file size: 10MB
        </p>
      </div>
      <input 
        id="lease-upload"
        type="file" 
        accept=".pdf,.doc,.docx" 
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
              setLeaseText(event.target.result);
            };
            reader.readAsText(file);
          }
        }}
        className="hidden"
      />
    </div>
  </label>
</div>           
            <Button 
              onClick={analyzeLease} 
              disabled={!leaseText || isAnalyzing}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white transition-colors duration-300 flex items-center justify-center space-x-2 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin">
                    <SearchCheck size={20} />
                  </div>
                  <span>Analyzing...</span>
                </div>
              ) : (
                <>
                  <SearchCheck size={20} />
                  <span>Analyze Lease</span>
                </>
              )}
            </Button>
            
            {analysisResult && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-6 p-6 bg-white border-2 border-amber-200 rounded-xl shadow-lg"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <SearchCheck className="text-amber-600" size={24} />
                  <h3 className="text-xl font-semibold text-amber-900">
                    Analysis Results
                  </h3>
                </div>
                <p className="text-amber-900 leading-relaxed">
                  {analysisResult}
                </p>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default LeaseAnalysisApp;