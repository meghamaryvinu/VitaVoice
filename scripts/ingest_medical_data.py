#!/usr/bin/env python3
"""
Medical Data Ingestion Script (Python)
Fetches and processes real data from Eka-IndicMTEB and Disease Ontology

Usage:
  python3 ingest_medical_data.py
  
Requirements:
  pip install requests obonet pandas huggingface-hub
"""

import json
import sys
from datetime import datetime
from typing import List, Dict, Any

try:
    import requests
    import pandas as pd
except ImportError:
    print("❌ Missing dependencies. Install with:")
    print("   pip install requests pandas")
    sys.exit(1)


class MedicalDataIngestion:
    """Fetches and normalizes medical data from multiple sources"""
    
    DISEASE_ONTOLOGY_URL = "https://www.disease-ontology.org/api/metadata"
    EKA_LANGUAGES = ["en", "hi", "bn", "ta", "te", "kn", "ml", "mr"]
    
    def __init__(self):
        self.entities = []
        self.mappings = []
        self.metadata = {
            "ingestedAt": datetime.now().isoformat(),
            "sources": []
        }
    
    def fetch_disease_ontology(self, sample_dois: List[str] = None):
        """Fetch diseases from Disease Ontology API"""
        print("📥 Fetching Disease Ontology...")
        
        # Sample DOIDs to fetch (can expand)
        sample_dois = sample_dois or [
            "DOID:0081086",  # COVID-19
            "DOID:8469",     # Influenza
            "DOID:552",      # Pneumonia
            "DOID:9351",     # Diabetes
            "DOID:1816",     # Measles
            "DOID:4195",     # Tuberculosis
        ]
        
        diseases = []
        
        for doid in sample_dois:
            try:
                url = f"{self.DISEASE_ONTOLOGY_URL}/{doid}"
                response = requests.get(url, timeout=10)
                response.raise_for_status()
                
                data = response.json()
                disease = self._normalize_do_entity(data, doid)
                diseases.append(disease)
                print(f"  ✓ {disease['name']} ({doid})")
                
            except Exception as e:
                print(f"  ✗ Failed to fetch {doid}: {e}")
        
        print(f"✅ Disease Ontology: {len(diseases)} diseases fetched\n")
        return diseases
    
    def fetch_eka_indicmteb(self, limit: int = 100):
        """Fetch Eka-IndicMTEB dataset from Hugging Face"""
        print("📥 Fetching Eka-IndicMTEB dataset...")
        print("ℹ️  Note: Requires HuggingFace API token for authentication")
        print("   Set HF_TOKEN environment variable or use huggingface-cli login\n")
        
        try:
            from datasets import load_dataset
            
            # Load dataset (will prompt for auth if needed)
            dataset = load_dataset("ekacare/Eka-IndicMTEB", trust_remote_code=True)
            
            # Process samples
            entities = []
            for i, sample in enumerate(dataset['train']):
                if i >= limit:
                    break
                
                # Eka-IndicMTEB structure varies; adapt as needed
                entity = {
                    "id": f"eka_term_{i}",
                    "name": sample.get('query', sample.get('text', f'Term {i}')),
                    "source": "Eka-IndicMTEB",
                    "licence": "CC-BY-SA-4.0"
                }
                entities.append(entity)
            
            print(f"✅ Eka-IndicMTEB: {len(entities)} terms fetched\n")
            return entities
            
        except ImportError:
            print("⚠️  datasets library not installed")
            print("   Install with: pip install datasets")
            print("   Skipping Eka-IndicMTEB ingestion\n")
            return []
        except Exception as e:
            print(f"❌ Failed to fetch Eka-IndicMTEB: {e}")
            print("   This is optional; continuing with Disease Ontology data\n")
            return []
    
    def _normalize_do_entity(self, do_data: Dict, doid: str) -> Dict[str, Any]:
        """Convert Disease Ontology API response to MedicalEntity format"""
        return {
            "id": f"disease_{doid.split(':')[1].lower()}",
            "type": "disease",
            "name": do_data.get("name", "Unknown"),
            "aliases": do_data.get("synonyms", []),
            "languages": {
                "en": do_data.get("name", ""),
                # Add translations here if available
            },
            "diseaseOntologyId": doid,
            "description": do_data.get("def", ""),
            "source": "Disease Ontology",
            "licence": "https://www.disease-ontology.org/about/DO_FAIR",
            "references": [f"https://www.disease-ontology.org/DO_{doid}"],
            "severity": "unknown",
            "emergencyFlag": False,
            "confidence": 0.85
        }
    
    def generate_report(self, output_file: str = "ingestion-report.json"):
        """Generate ingestion report"""
        print(f"📊 Generating ingestion report...\n")
        
        report = {
            "summary": {
                "totalEntities": len(self.entities),
                "totalMappings": len(self.mappings),
                "timestamp": datetime.now().isoformat(),
                "sourcesCount": len(self.metadata["sources"])
            },
            "metadata": self.metadata,
            "sampleEntities": self.entities[:5],
            "nextSteps": [
                "1. Review sample entities for correctness",
                "2. Validate disease definitions",
                "3. Add multilingual translations",
                "4. Create vector embeddings",
                "5. Load into medicalKnowledgeBase.ts",
                "6. Integrate with aiService.chat()"
            ],
            "statistics": {
                "byType": self._count_by_type(),
                "bySeverity": self._count_by_severity(),
                "emergencyConditions": len([e for e in self.entities if e.get("emergencyFlag")])
            }
        }
        
        # Save report
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        
        print(f"✅ Report saved to: {output_file}\n")
        
        # Print summary
        print("=" * 60)
        print("INGESTION SUMMARY")
        print("=" * 60)
        print(f"Total Entities: {report['summary']['totalEntities']}")
        print(f"Total Mappings: {report['summary']['totalMappings']}")
        print(f"Sources: {report['summary']['sourcesCount']}")
        print(f"Emergency Conditions: {report['statistics']['emergencyConditions']}")
        print("\nNext Steps:")
        for step in report['nextSteps']:
            print(f"  {step}")
        print("=" * 60)
        
        return report
    
    def _count_by_type(self) -> Dict[str, int]:
        """Count entities by type"""
        counts = {}
        for entity in self.entities:
            entity_type = entity.get("type", "unknown")
            counts[entity_type] = counts.get(entity_type, 0) + 1
        return counts
    
    def _count_by_severity(self) -> Dict[str, int]:
        """Count entities by severity"""
        counts = {}
        for entity in self.entities:
            severity = entity.get("severity", "unknown")
            counts[severity] = counts.get(severity, 0) + 1
        return counts
    
    def run(self):
        """Execute ingestion pipeline"""
        print("\n" + "=" * 60)
        print("MEDICAL DATA INGESTION")
        print("=" * 60 + "\n")
        
        # 1. Fetch Disease Ontology
        do_diseases = self.fetch_disease_ontology()
        self.entities.extend(do_diseases)
        self.metadata["sources"].append({
            "name": "Disease Ontology",
            "entries": len(do_diseases),
            "url": "https://www.disease-ontology.org/",
            "licence": "https://www.disease-ontology.org/about/DO_FAIR"
        })
        
        # 2. Fetch Eka-IndicMTEB (optional)
        eka_entities = self.fetch_eka_indicmteb(limit=50)
        if eka_entities:
            self.entities.extend(eka_entities)
            self.metadata["sources"].append({
                "name": "Eka-IndicMTEB",
                "entries": len(eka_entities),
                "url": "https://huggingface.co/datasets/ekacare/Eka-IndicMTEB",
                "licence": "CC-BY-SA-4.0"
            })
        
        # 3. Generate report
        report = self.generate_report()
        
        return report


def main():
    """Main entry point"""
    ingestion = MedicalDataIngestion()
    report = ingestion.run()
    
    print("\n✅ Ingestion complete!")
    print(f"\nRetrieved {report['summary']['totalEntities']} entities from {report['summary']['sourcesCount']} sources")
    
    return report


if __name__ == "__main__":
    main()
