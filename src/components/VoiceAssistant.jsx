import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('🎤 Listening... Speak now');
      };

      recognition.onresult = (event) => {
        const current = event.resultIndex;
        const transcriptText = event.results[current][0].transcript;
        setTranscript(transcriptText);
        
        if (event.results[current].isFinal) {
          processVoiceCommand(transcriptText);
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setTranscript(`❌ Error: ${event.error}. Try again.`);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognition);
    }
  }, []);

  const processVoiceCommand = (command) => {
    const lowerCommand = command.toLowerCase().trim();
    
    // Enhanced Natural Language Commands
    if (lowerCommand.includes('go to') || lowerCommand.includes('navigate to') || lowerCommand.includes('open')) {
      handleNavigation(lowerCommand);
    }
    else if (lowerCommand.includes('set') || lowerCommand.includes('fill') || lowerCommand.includes('enter')) {
      handleFormFilling(lowerCommand);
    }
    else if (lowerCommand.includes('submit') || lowerCommand.includes('save') || lowerCommand.includes('post')) {
      handleFormSubmission(lowerCommand);
    }
    else if (lowerCommand.includes('clear') || lowerCommand.includes('reset') || lowerCommand.includes('delete')) {
      handleFormClear(lowerCommand);
    }
    else if (lowerCommand.includes('logout') || lowerCommand.includes('sign out')) {
      handleLogout(lowerCommand);
    }
    else {
      speak(`I didn't understand: "${command}". Try saying "help" for available commands.`);
    }
  };

  const handleNavigation = (command) => {
    if (command.includes('home') || command.includes('main')) {
      navigate('/');
      speak('Going to homepage');
    }
    else if (command.includes('job') && command.includes('list')) {
      navigate('/jobs');
      speak('Showing all job listings');
    }
    else if (command.includes('post job') || command.includes('create job')) {
      if (user?.role === 'employer') {
        navigate('/post-job');
        speak('Opening job creation form');
      } else {
        speak('Only employers can post jobs. Please register as an employer.');
      }
    }
    else if (command.includes('dashboard')) {
      if (user?.role === 'employer') {
        navigate('/dashboard/employer');
      } else {
        navigate('/dashboard/seeker');
      }
      speak('Opening your dashboard');
    }
    else if (command.includes('resume') || command.includes('cv')) {
      navigate('/resume-builder');
      speak('Opening resume builder');
    }
    else if (command.includes('application')) {
      navigate('/applications');
      speak('Showing your applications');
    }
    else if (command.includes('login') || command.includes('sign in')) {
      navigate('/login');
      speak('Opening login page');
    }
    else if (command.includes('register') || command.includes('sign up')) {
      navigate('/register');
      speak('Opening registration page');
    }
  };

  const handleFormFilling = (command) => {
    const currentPage = location.pathname;
    
    // Job Post Form
    if (currentPage === '/post-job') {
      if (command.includes('title') || command.includes('position')) {
        const title = extractValue(command, ['title', 'position', 'role']);
        updateFormField('title', title);
        speak(`Job title set to: ${title}`);
      }
      else if (command.includes('company') || command.includes('organization')) {
        const company = extractValue(command, ['company', 'organization', 'firm']);
        updateFormField('company', company);
        speak(`Company set to: ${company}`);
      }
      else if (command.includes('location') || command.includes('city') || command.includes('place')) {
        const location = extractValue(command, ['location', 'city', 'place', 'area']);
        updateFormField('location', location);
        speak(`Location set to: ${location}`);
      }
      else if (command.includes('type') || command.includes('employment')) {
        const type = extractJobType(command);
        updateFormField('type', type);
        speak(`Job type set to: ${type}`);
      }
      else if (command.includes('salary') || command.includes('pay') || command.includes('compensation')) {
        const salary = extractValue(command, ['salary', 'pay', 'compensation', 'income']);
        updateFormField('salary', salary);
        speak(`Salary set to: ${salary}`);
      }
    }
    
    // Registration Form
    else if (currentPage === '/register') {
      if (command.includes('name') || command.includes('full name')) {
        const name = extractValue(command, ['name', 'full name']);
        updateFormField('name', name);
        speak(`Name set to: ${name}`);
      }
      else if (command.includes('email') || command.includes('mail')) {
        const email = extractValue(command, ['email', 'mail']);
        updateFormField('email', email);
        speak(`Email set to: ${email}`);
      }
      else if (command.includes('password')) {
        const password = extractValue(command, ['password', 'pass']);
        updateFormField('password', password);
        speak('Password set');
      }
      else if (command.includes('role') || command.includes('type') || command.includes('i am')) {
        const role = command.includes('employer') ? 'employer' : 'seeker';
        updateFormField('role', role);
        speak(`Role set to: ${role}`);
      }
    }
    
    // Login Form
    else if (currentPage === '/login') {
      if (command.includes('email') || command.includes('mail')) {
        const email = extractValue(command, ['email', 'mail']);
        updateFormField('email', email);
        speak(`Email set to: ${email}`);
      }
      else if (command.includes('password')) {
        const password = extractValue(command, ['password', 'pass']);
        updateFormField('password', password);
        speak('Password set');
      }
    }
    
    // Resume Builder
    else if (currentPage === '/resume-builder') {
      if (command.includes('name') || command.includes('full name')) {
        const name = extractValue(command, ['name', 'full name']);
        updateNestedFormField('personalInfo', 'name', name);
        speak(`Name set to: ${name}`);
      }
      else if (command.includes('phone') || command.includes('number') || command.includes('contact')) {
        const phone = extractValue(command, ['phone', 'number', 'contact', 'mobile']);
        updateNestedFormField('personalInfo', 'phone', phone);
        speak(`Phone number set to: ${phone}`);
      }
      else if (command.includes('address') || command.includes('location')) {
        const address = extractValue(command, ['address', 'location']);
        updateNestedFormField('personalInfo', 'address', address);
        speak(`Address set to: ${address}`);
      }
    }
  };

  const handleFormSubmission = (command) => {
    speak('Submitting form...');
    setTimeout(() => {
      const submitButton = document.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.click();
      }
    }, 1500);
  };

  const handleFormClear = (command) => {
    speak('Clearing form...');
    const form = document.querySelector('form');
    if (form) {
      form.reset();
    }
  };

  const handleLogout = (command) => {
    speak('Logging out...');
    setTimeout(() => {
      logout();
      navigate('/');
    }, 1000);
  };

  // Helper function to extract values from natural language
  const extractValue = (command, keywords) => {
    for (let keyword of keywords) {
      if (command.includes(keyword)) {
        // Extract text after the keyword
        const parts = command.split(keyword);
        if (parts.length > 1) {
          return parts[1].replace(/^(is|to|as|for)\s+/, '').trim();
        }
      }
    }
    return command.replace(/(set|fill|enter)\s+/i, '').trim();
  };

  const extractJobType = (command) => {
    if (command.includes('full')) return 'full-time';
    if (command.includes('part')) return 'part-time';
    if (command.includes('contract')) return 'contract';
    if (command.includes('intern')) return 'internship';
    return 'full-time';
  };

  const updateFormField = (fieldName, value) => {
    const input = document.querySelector(`[name="${fieldName}"]`);
    if (input) {
      input.value = value;
      const event = new Event('input', { bubbles: true });
      input.dispatchEvent(event);
    }
  };

  const updateNestedFormField = (parent, fieldName, value) => {
    const input = document.querySelector(`[name="${fieldName}"]`);
    if (input) {
      input.value = value;
      const event = new Event('input', { bubbles: true });
      input.dispatchEvent(event);
    }
  };

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      speechSynthesis.speak(utterance);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognition.stop();
    } else {
      setTranscript('');
      recognition.start();
      setIsOpen(true);
    }
  };

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  if (!recognition) {
    return (
      <div className="voice-assistant">
        <button className="voice-btn disabled" title="Voice recognition not supported">
          🎤
        </button>
      </div>
    );
  }

  const getFormSpecificCommands = () => {
    switch (location.pathname) {
      case '/post-job':
        return [
          '"Set job title to Software Engineer"',
          '"Fill company with Google"',
          '"Enter location as New York"',
          '"Set job type to full-time"',
          '"Set salary to $90,000"',
          '"Submit this job"'
        ];
      case '/register':
        return [
          '"Set name to John Doe"',
          '"Fill email with john@example.com"',
          '"Enter password as secure123"',
          '"Set role to job seeker"',
          '"Submit registration"'
        ];
      case '/login':
        return [
          '"Set email to myemail@example.com"',
          '"Enter password as mypassword"',
          '"Submit login"'
        ];
      case '/resume-builder':
        return [
          '"Set full name to Jane Smith"',
          '"Fill phone number with 555-1234"',
          '"Enter address as Los Angeles"',
          '"Download my resume"'
        ];
      default:
        return [
          '"Go to home page"',
          '"Show me jobs"',
          '"Open my dashboard"',
          '"Build a resume"',
          '"Log me out"'
        ];
    }
  };

  return (
    <div className="voice-assistant">
      {isOpen && (
        <div className="voice-panel card">
          <div className="flex-between">
            <h4>🎤 Voice Assistant</h4>
            <button 
              onClick={togglePanel}
              className="btn btn-secondary"
              style={{padding: '0.25rem 0.5rem', fontSize: '0.8rem'}}
            >
              Close
            </button>
          </div>
          
          <div className="voice-text">
            {transcript || 'Click the microphone and speak a command...'}
          </div>
          
          <div className="voice-commands">
            <p><strong>💡 Try saying:</strong></p>
            <ul>
              {getFormSpecificCommands().map((cmd, index) => (
                <li key={index}>{cmd}</li>
              ))}
            </ul>
            
            <p><strong>🔧 General Commands:</strong></p>
            <ul>
              <li>"Submit the form"</li>
              <li>"Clear all fields"</li>
              <li>"Go to [page name]"</li>
              <li>"Log me out"</li>
            </ul>
          </div>
        </div>
      )}
      
      <button 
        className={`voice-btn ${isListening ? 'listening' : ''}`}
        onClick={toggleListening}
        onDoubleClick={togglePanel}
        title={isListening ? 'Stop listening' : 'Start voice commands'}
      >
        {isListening ? '🔴' : '🎤'}
      </button>
    </div>
  );
};

export default VoiceAssistant;