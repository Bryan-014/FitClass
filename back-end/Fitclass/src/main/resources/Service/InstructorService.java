import com.example.demo.model.Instructor;
import com.example.demo.repository.InstructorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class InstructorService {

    @Autowired
    private InstructorRepository instructorRepository;

    public Instructor saveInstructor(Instructor instructor) {
        return instructorRepository.save(instructor);
    }

    public List<Instructor> getAllInstructors() {
        return instructorRepository.findAll();
    }

    public Optional<Instructor> getInstructorById(Long id) {
        return instructorRepository.findById(id);
    }

    public void deleteInstructor(Long id) {
        instructorRepository.deleteById(id);
    }

    public Instructor updateInstructor(Long id, Instructor instructorDetails) {
        Instructor instructor = instructorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Instrutor não encontrado com id: " + id));

        instructor.setFirstName(instructorDetails.getUsername());
        instructor.setEmail(instructorDetails.getPassword());
        instructor.setExpertise(instructorDetails.getEspeciality());

        return instructorRepository.save(instructor);
    }
}