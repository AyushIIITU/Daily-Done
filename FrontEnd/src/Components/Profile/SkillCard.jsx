import { SKILL_COLORS } from "../../Constants/Skills";





export function SkillCard({  skills }) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      {/* <h3 className="text-lg font-semibold mb-6">{category}</h3> */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {skills?.map((skill) => (
          <div
            key={skill}
            className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-all hover:shadow-md"
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mb-2"
              style={{ backgroundColor: `${SKILL_COLORS[skill] || '#6b7280'}20` }}
            >
              <span 
                className="text-sm font-semibold" 
                style={{ color: SKILL_COLORS[skill] || '#6b7280' }}
              >
                {skill.slice(0, 2)}
              </span>
            </div>
            <span className="text-sm font-medium text-gray-800">{skill}</span>
          </div>
        ))}
      </div>
    </div>
  );
}